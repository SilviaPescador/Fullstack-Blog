import { createClient } from '@/lib/supabase/server';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

async function getPosts() {
	try {
		// throw new Error ('500 error de prueba');
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
			return { 
				posts: [], 
				error: { 
					message: error.message || 'Error al conectar con la base de datos',
					code: error.code 
				} 
			};
		}

		// Formatear los posts para mantener compatibilidad
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

		return { posts: formattedPosts, error: null };
	} catch (error) {
		console.error('Error fetching posts:', error);
		return { 
			posts: [], 
			error: { 
				message: error.message || 'Error inesperado del servidor',
				code: 'UNKNOWN_ERROR' 
			} 
		};
	}
}

export default async function Home() {
	const { posts, error } = await getPosts();

	return <HomeClient initialPosts={posts} initialError={error} />;
}
