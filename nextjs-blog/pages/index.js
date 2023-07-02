import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import useSWR, { mutate } from "swr";
import PostArticle from "../components/postArticle";
import utilStyles from "../styles/utils.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home({ initialData }) {
	const { data, error } = useSWR("http://localhost:3001/posts", fetcher, {
		initialData: initialData || undefined,
	});
	if (error) return <div>Failed to load </div>;
	if (!data) return <div>Loading...</div>;

	const resetPosts = async () => {
		mutate("http://localhost:3001/posts");
	};

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={utilStyles.headingMd}>
				<p className="mx-3 text-center fw-bold">
					Aquí se plasman sueños, noticias, emociones e ideas de célula y metal.
				</p>
			</section>
			<section className="pb-5">
				{data.map((post) => (
					<PostArticle
						postData={post}
						key={post.id}
						onDelete={resetPosts}
						fullPost={false}
						home
					/>
				))}
			</section>
		</Layout>
	);
}

export async function getStaticProps() {
	const res = await fetch("http://localhost:3001/posts");
	const initialData = await res.json();

	return {
		props: {
			initialData,
		},
	};
}
