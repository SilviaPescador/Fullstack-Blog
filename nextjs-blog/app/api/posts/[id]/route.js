import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Obtener un post por ID
export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const supabase = await createClient();

		const { data: post, error } = await supabase
			.from('posts')
			.select(`
				*,
				profiles:author_id (
					id,
					full_name,
					email,
					avatar_url
				)
			`)
			.eq('id', id)
			.single();

		if (error || !post) {
			return NextResponse.json(
				{ error: 'Post no encontrado' },
				{ status: 404 }
			);
		}

		// Formatear el post para mantener compatibilidad
		const formattedPost = {
			id: post.id,
			title: post.title,
			content: post.content,
			image: post.image_url,
			author: post.profiles?.full_name || post.profiles?.email || 'Anónimo',
			author_id: post.author_id,
			post_date: post.created_at,
			created_at: post.created_at,
			updated_at: post.updated_at,
		};

		return NextResponse.json(formattedPost);
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
		const supabase = await createClient();

		// Verificar autenticación
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Debes iniciar sesión para editar un post' },
				{ status: 401 }
			);
		}

		// Obtener el post existente
		const { data: existingPost, error: fetchError } = await supabase
			.from('posts')
			.select('*, profiles:author_id(role)')
			.eq('id', id)
			.single();

		if (fetchError || !existingPost) {
			return NextResponse.json(
				{ error: 'El post no existe' },
				{ status: 404 }
			);
		}

		// Verificar permisos: autor del post o admin
		const { data: userProfile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		const isAuthor = existingPost.author_id === user.id;
		const isAdmin = userProfile?.role === 'admin';

		if (!isAuthor && !isAdmin) {
			return NextResponse.json(
				{ error: 'No tienes permiso para editar este post' },
				{ status: 403 }
			);
		}

		if (userProfile?.role === 'banned') {
			return NextResponse.json(
				{ error: 'Tu cuenta ha sido suspendida' },
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		const title = formData.get('title');
		const content = formData.get('content');
		const image = formData.get('image');

		const updatedFields = {};

		if (title && title !== existingPost.title) {
			updatedFields.title = title;
		}

		if (content && content !== existingPost.content) {
			updatedFields.content = content;
		}

		// Procesar imagen
		if (image && image.size > 0) {
			// Eliminar imagen anterior de Storage si existe
			if (existingPost.image_url && existingPost.image_url.includes('supabase')) {
				const oldPath = existingPost.image_url.split('/post-images/')[1];
				if (oldPath) {
					await supabase.storage.from('post-images').remove([oldPath]);
				}
			}

			// Subir nueva imagen
			const fileExt = image.name.split('.').pop();
			const fileName = `${user.id}/${Date.now()}.${fileExt}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from('post-images')
				.upload(fileName, image, {
					cacheControl: '3600',
					upsert: false,
				});

			if (uploadError) {
				console.error('Error uploading image:', uploadError);
				return NextResponse.json(
					{ error: 'Error al subir la imagen' },
					{ status: 500 }
				);
			}

			const { data: publicUrl } = supabase.storage
				.from('post-images')
				.getPublicUrl(uploadData.path);

			updatedFields.image_url = publicUrl.publicUrl;
		}

		// Si no hay campos actualizados
		if (Object.keys(updatedFields).length === 0) {
			return NextResponse.json({
				message: 'No se han modificado campos de datos',
				post: existingPost,
			});
		}

		// Actualizar en Supabase
		const { data: updatedPost, error: updateError } = await supabase
			.from('posts')
			.update(updatedFields)
			.eq('id', id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating post:', updateError);
			return NextResponse.json(
				{ error: 'Error al actualizar el post' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Post actualizado con éxito',
			updatedPost,
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
		const supabase = await createClient();

		// Verificar autenticación
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Debes iniciar sesión para eliminar un post' },
				{ status: 401 }
			);
		}

		// Obtener el post
		const { data: post, error: fetchError } = await supabase
			.from('posts')
			.select('*')
			.eq('id', id)
			.single();

		if (fetchError || !post) {
			return NextResponse.json(
				{ error: 'El post no existe' },
				{ status: 404 }
			);
		}

		// Verificar permisos: autor del post o admin
		const { data: userProfile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		const isAuthor = post.author_id === user.id;
		const isAdmin = userProfile?.role === 'admin';

		if (!isAuthor && !isAdmin) {
			return NextResponse.json(
				{ error: 'No tienes permiso para eliminar este post' },
				{ status: 403 }
			);
		}

		if (userProfile?.role === 'banned') {
			return NextResponse.json(
				{ error: 'Tu cuenta ha sido suspendida' },
				{ status: 403 }
			);
		}

		// Eliminar el post
		const { error: deleteError } = await supabase
			.from('posts')
			.delete()
			.eq('id', id);

		if (deleteError) {
			console.error('Error deleting post:', deleteError);
			return NextResponse.json(
				{ error: 'Error al eliminar el post' },
				{ status: 500 }
			);
		}

		// Eliminar la imagen de Storage si existe
		if (post.image_url && post.image_url.includes('supabase')) {
			const imagePath = post.image_url.split('/post-images/')[1];
			if (imagePath) {
				await supabase.storage.from('post-images').remove([imagePath]);
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
