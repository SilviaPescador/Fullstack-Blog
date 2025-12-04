import { createClient } from '@/lib/supabase/server';
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
					email,
					avatar_url
				)
			`)
			.eq('id', id)
			.single();

		if (error || !post) {
			return null;
		}

		// Formatear el post
		return {
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
	} catch (error) {
		console.error('Error fetching post:', error);
		return null;
	}
}

export default async function PostPage({ params }) {
	const { id } = await params;
	const initialPost = await getPost(id);

	if (!initialPost) {
		return <div>Post no encontrado</div>;
	}

	return <PostPageClient initialPost={initialPost} postId={id} />;
}
