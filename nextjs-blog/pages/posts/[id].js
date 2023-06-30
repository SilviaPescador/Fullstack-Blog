import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import PostService from "../../services/postService";
import PostArticle from "../../components/postArticle"

export default function PostPage() {
	const router = useRouter();
	const { id } = router.query;
	const [postData, setPostData] = useState(null);
	const [ edited, setIsEdited ] = useState(false)

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const postService = new PostService();
				const response = await postService.getPosts(id);
				console.log(response)
				setPostData(response);
			} catch (error) {
				console.error(error);
			}
		};

		if (id) {
			fetchPostData();
		}
	}, [id, edited]);

	if (!postData) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<PostArticle postData={postData} setIsEdited={setIsEdited} fullPost />
		</Layout>
	);
}
