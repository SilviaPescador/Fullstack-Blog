import pool from '@/lib/db';
import PostPageClient from './PostPageClient';

export const dynamic = 'force-dynamic';

async function getPost(id) {
	try {
		const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
		return posts[0] || null;
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

