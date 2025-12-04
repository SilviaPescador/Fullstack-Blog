import { createClient } from '@/lib/supabase/server';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

async function getPosts() {
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
			return [];
		}

		// Formatear los posts para mantener compatibilidad
		return posts.map((post) => ({
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
	} catch (error) {
		console.error('Error fetching posts:', error);
		return [];
	}
}

export default async function Home() {
	const initialPosts = await getPosts();

	return <HomeClient initialPosts={initialPosts} />;
}
