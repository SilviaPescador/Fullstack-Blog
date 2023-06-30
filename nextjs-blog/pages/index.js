import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
// import useSWR from "swr";
import PostArticle from "../components/postArticle";
import utilStyles from "../styles/utils.module.css";
import PostService from "../services/postService"
import { useEffect, useState } from "react";

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
	const [postsData, setPostsData ] = useState(null)
	// const { data, error } = useSWR(() => data ? `http://localhost:3001/posts/${data.id}` : null, fetcher);
	// if (error) return <div>Failed to load </div>;
	// if (!data) return <div>Loading...</div>;
	useEffect (() => {
		const fetchPostData = async () => {
			try {
				const postService = new PostService()
				const response = await postService.getPosts()
				console.log(response)
				setPostsData(response)

			} catch (error) {
				console.error(error)
			}
		}

		fetchPostData()
	}, []) 

	if (!postsData) return <div>Loading...</div>;
	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={utilStyles.headingMd}>
				<p className="mx-3">Welcome to my blog</p>
			</section>
			<section>
				{postsData.map((post) => (
					<PostArticle postData={post} key={post.id} />
				))}
			</section>
		</Layout>
	);
}
