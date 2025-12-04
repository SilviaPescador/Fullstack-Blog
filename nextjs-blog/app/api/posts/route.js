import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';

// GET - Obtener todos los posts
export async function GET() {
	try {
		const [posts] = await pool.query(
			'SELECT * FROM posts ORDER BY post_date DESC'
		);

		// Añadir URL completa a las imágenes
		const postsWithImageUrl = posts.map((post) =>
			post.image
				? {
						...post,
						image: post.image,
				  }
				: {
						...post,
						image: null,
				  }
		);

		return NextResponse.json(postsWithImageUrl);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return NextResponse.json(
			{ error: 'Error al obtener los posts' },
			{ status: 500 }
		);
	}
}

// POST - Crear nuevo post
export async function POST(request) {
	try {
		const formData = await request.formData();
		const title = formData.get('title');
		const content = formData.get('content');
		const author = formData.get('author') || 'Silvia Pescador';
		const image = formData.get('image');

		let imageUrl = '';

		if (image && image.size > 0) {
			// Asegurar que el directorio existe
			const uploadDir = path.join(process.cwd(), 'public/images');
			try {
				await mkdir(uploadDir, { recursive: true });
			} catch (err) {
				// El directorio ya existe, continuar
			}

			// Guardar la imagen
			const bytes = await image.arrayBuffer();
			const buffer = Buffer.from(bytes);
			const imagePath = path.join(uploadDir, image.name);
			await writeFile(imagePath, buffer);
			imageUrl = `/images/${image.name}`;
		}

		const [result] = await pool.query(
			'INSERT INTO posts (title, image, content, author) VALUES (?, ?, ?, ?)',
			[title, imageUrl, content, author]
		);

		return NextResponse.json({ insertId: result.insertId }, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return NextResponse.json(
			{ error: 'Error al crear el post' },
			{ status: 500 }
		);
	}
}

