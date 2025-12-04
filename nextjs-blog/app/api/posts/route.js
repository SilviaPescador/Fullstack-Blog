import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Obtener todos los posts
export async function GET() {
	try {
		const supabase = await createClient();

		const { data: posts, error } = await supabase
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
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching posts:', error);
			return NextResponse.json(
				{ error: 'Error al obtener los posts' },
				{ status: 500 }
			);
		}

		// Formatear los posts para mantener compatibilidad con el frontend
		const formattedPosts = posts.map((post) => ({
			id: post.id,
			title: post.title,
			content: post.content,
			image: post.image_url,
			author: post.profiles?.full_name || post.profiles?.email || 'Anónimo',
			author_id: post.author_id,
			post_date: post.created_at,
			created_at: post.created_at,
			updated_at: post.updated_at,
		}));

		return NextResponse.json(formattedPosts);
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
		const supabase = await createClient();

		// Verificar autenticación
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Debes iniciar sesión para crear un post' },
				{ status: 401 }
			);
		}

		// Verificar que el usuario no esté baneado
		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (profile?.role === 'banned') {
			return NextResponse.json(
				{ error: 'Tu cuenta ha sido suspendida' },
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		const title = formData.get('title');
		const content = formData.get('content');
		const image = formData.get('image');

		let imageUrl = null;

		// Subir imagen a Supabase Storage
		if (image && image.size > 0) {
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

			// Obtener URL pública de la imagen
			const { data: publicUrl } = supabase.storage
				.from('post-images')
				.getPublicUrl(uploadData.path);

			imageUrl = publicUrl.publicUrl;
		}

		// Insertar el post
		const { data: newPost, error } = await supabase
			.from('posts')
			.insert({
				title,
				content,
				image_url: imageUrl,
				author_id: user.id,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating post:', error);
			return NextResponse.json(
				{ error: 'Error al crear el post' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ insertId: newPost.id }, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return NextResponse.json(
			{ error: 'Error al crear el post' },
			{ status: 500 }
		);
	}
}
