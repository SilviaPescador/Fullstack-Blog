import pool from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

async function getPosts() {
	try {
		const [posts] = await pool.query(
			'SELECT * FROM posts ORDER BY post_date DESC'
		);
		return posts;
	} catch (error) {
		console.error('Error fetching posts:', error);
		return [];
	}
}

export default async function Home() {
	const initialPosts = await getPosts();

	return <HomeClient initialPosts={initialPosts} />;
}

