import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import useSWR from "swr";
import PostArticle from "../components/postArticle";
import utilStyles from "../styles/utils.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
	const { data, error } = useSWR("http://localhost:3001/posts/", fetcher);
	if (error) return <div>Failed to load</div>;
	if (!data) return <div>Loading...</div>;

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={utilStyles.headingMd}>
				<p className="mx-3">Welcome to my blog</p>
			</section>
			<section>
				{data.map((post) => (
					<PostArticle postData={post} key={post.id} />
				))}
			</section>
		</Layout>
	);
}
