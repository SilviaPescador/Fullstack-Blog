import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import useSWR, {mutate} from "swr";
import PostArticle from "../components/postArticle";
import utilStyles from "../styles/utils.module.css";


const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
	const { data, error } = useSWR("http://localhost:3001/posts", fetcher);
	if (error) return <div>Failed to load </div>;
	if (!data) return <div>Loading...</div>;
	

	const resetPosts = async () =>{
		mutate("http://localhost:3001/posts")
	}

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={utilStyles.headingMd}>
				<p className="mx-3 text-center">Aquí se plasman sueños, noticias, emociones e ideas de célula y metal.</p>
			</section>
			<section>
				{data.map((post) => (
					<PostArticle postData={post} key={post.id} onDelete={resetPosts} fullPost={false} home/>
				))}
			</section>
		</Layout>
	);
}
