import { NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';

// GET - Obtener un post por ID
export async function GET(request, { params }) {
	try {
		const { id } = await params;

		const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);

		if (posts.length === 0) {
			return NextResponse.json(
				{ error: 'Post no encontrado' },
				{ status: 404 }
			);
		}

		const post = posts[0];
		const postWithImageUrl = post.image
			? {
					...post,
					image: post.image,
			  }
			: {
					...post,
					image: null,
			  };

		return NextResponse.json(postWithImageUrl);
	} catch (error) {
		console.error('Error fetching post:', error);
		return NextResponse.json(
			{ error: 'Error al obtener el post' },
			{ status: 500 }
		);
	}
}

// PATCH - Actualizar un post
export async function PATCH(request, { params }) {
	try {
		const { id } = await params;
		const formData = await request.formData();

		// Verificar que el post existe
		const [existingPosts] = await pool.query(
			'SELECT * FROM posts WHERE id = ?',
			[id]
		);

		if (existingPosts.length === 0) {
			return NextResponse.json(
				{ error: 'El post no está en la base de datos' },
				{ status: 404 }
			);
		}

		const existingPost = existingPosts[0];
		const updatedFields = {};

		// Procesar campos de texto
		const title = formData.get('title');
		const content = formData.get('content');

		if (title && title !== existingPost.title) {
			updatedFields.title = title;
		}

		if (content && content !== existingPost.content) {
			updatedFields.content = content;
		}

		// Procesar imagen
		const image = formData.get('image');

		if (image && image.size > 0) {
			// Eliminar imagen anterior si existe
			if (existingPost.image) {
				const oldImagePath = path.join(
					process.cwd(),
					'public',
					existingPost.image
				);
				try {
					await unlink(oldImagePath);
				} catch (err) {
					console.error('Error deleting old image:', err);
				}
			}

			// Asegurar que el directorio existe
			const uploadDir = path.join(process.cwd(), 'public/images');
			try {
				await mkdir(uploadDir, { recursive: true });
			} catch (err) {
				// El directorio ya existe
			}

			// Guardar nueva imagen
			const bytes = await image.arrayBuffer();
			const buffer = Buffer.from(bytes);
			const newImagePath = path.join(uploadDir, image.name);
			await writeFile(newImagePath, buffer);
			updatedFields.image = `/images/${image.name}`;
		}

		// Si no hay campos actualizados
		if (Object.keys(updatedFields).length === 0) {
			return NextResponse.json({
				message: 'No se han modificado campos de datos',
				post: existingPost,
			});
		}

		// Actualizar en la base de datos
		await pool.query('UPDATE posts SET ? WHERE id = ?', [updatedFields, id]);

		// Obtener el post actualizado
		const [updatedPosts] = await pool.query(
			'SELECT * FROM posts WHERE id = ?',
			[id]
		);

		return NextResponse.json({
			message: 'Post actualizado con éxito',
			updatedPost: updatedPosts[0],
		});
	} catch (error) {
		console.error('Error updating post:', error);
		return NextResponse.json(
			{ error: 'Error al actualizar el post' },
			{ status: 500 }
		);
	}
}

// DELETE - Eliminar un post
export async function DELETE(request, { params }) {
	try {
		const { id } = await params;

		// Verificar que el post existe
		const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);

		if (posts.length === 0) {
			return NextResponse.json(
				{ error: 'El post no existe o no tienes permiso para eliminarlo' },
				{ status: 404 }
			);
		}

		const post = posts[0];

		// Eliminar el post de la base de datos
		await pool.query('DELETE FROM posts WHERE id = ?', [id]);

		// Eliminar la imagen si existe
		if (post.image) {
			const imagePath = path.join(process.cwd(), 'public', post.image);
			try {
				await unlink(imagePath);
			} catch (err) {
				console.error('Error deleting image:', err);
			}
		}

		return NextResponse.json({
			message: 'El post ha sido eliminado exitosamente',
		});
	} catch (error) {
		console.error('Error deleting post:', error);
		return NextResponse.json(
			{ error: 'Error al eliminar el post' },
			{ status: 500 }
		);
	}
}

