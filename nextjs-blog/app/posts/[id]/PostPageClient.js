'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import PostService from '@/services/postService';
import PostArticle from '@/components/postArticle';

export default function PostPageClient({ initialPost, postId }) {
	const [postData, setPostData] = useState(initialPost);
	const [edited, setIsEdited] = useState(false);

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const postService = new PostService();
				const response = await postService.getPosts(postId);
				setPostData(response);
			} catch (error) {
				console.error(error);
			}
		};

		if (edited) {
			fetchPostData();
			setIsEdited(false);
		}
	}, [postId, edited]);

	if (!postData) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<PostArticle postData={postData} setIsEdited={setIsEdited} fullPost />
		</Layout>
	);
}

