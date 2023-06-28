import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import NewPostCard from "../../components/newPostCard";
// import Script from "next/script";

export default function CreateNew() {
	return (
		<Layout>
			<Head>
				<title>New Post</title>
			</Head>

			<NewPostCard />
		</Layout>
	);
}
