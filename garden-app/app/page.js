import { createClient } from '@/lib/supabase/server';
import { formatPost, getWateredPostIds } from '@/lib/posts';
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
					avatar_url
				)
			`)
			.eq('status', 'approved')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching posts:', error);
			return {
				posts: [],
				error: { message: error.message || 'Error al conectar con la base de datos', code: error.code },
			};
		}

		const wateredIds = await getWateredPostIds(supabase);
		const formattedPosts = posts.map((post) => formatPost(post, wateredIds));

		return { posts: formattedPosts, error: null };
	} catch (error) {
		console.error('Error fetching posts:', error);
		return {
			posts: [],
			error: { message: error.message || 'Error inesperado del servidor', code: 'UNKNOWN_ERROR' },
		};
	}
}

export default async function Home() {
	const { posts, error } = await getPosts();
	return <HomeClient initialPosts={posts} initialError={error} />;
}
