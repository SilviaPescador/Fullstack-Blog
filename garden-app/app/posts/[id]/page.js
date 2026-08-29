import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatPost, getWateredPostIds } from '@/lib/posts';
import PostPageClient from './PostPageClient';

export const dynamic = 'force-dynamic';

async function getPost(id) {
	try {
		const supabase = await createClient();

		const { data: post, error } = await supabase
			.from('posts')
			.select(`
				*,
				profiles:author_id (
					id,
					full_name,
					avatar_url
				)
			`)
			.eq('id', id)
			.single();

		if (error) {
			// Si es error de "no encontrado", devolver null
			if (error.code === 'PGRST116') {
				return { post: null, error: null };
			}
			// Otros errores
			return { 
				post: null, 
				error: { message: error.message, code: error.code } 
			};
		}

		const wateredIds = await getWateredPostIds(supabase);
		const formattedPost = formatPost(post, wateredIds);

		return { post: formattedPost, error: null };
	} catch (error) {
		console.error('Error fetching post:', error);
		return { 
			post: null, 
			error: { message: error.message || 'Error del servidor', code: 'UNKNOWN' } 
		};
	}
}

export default async function PostPage({ params }) {
	const { id } = await params;
	const { post, error } = await getPost(id);

	// Si no existe el post, mostrar 404
	if (!post && !error) {
		notFound();
	}

	return <PostPageClient initialPost={post} postId={id} initialError={error} />;
}
