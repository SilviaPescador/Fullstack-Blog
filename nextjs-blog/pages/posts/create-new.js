import Head from "next/head";
import Layout from "../../components/layout";
import NewPostCard from "../../components/newPostCard";

export default function CreateNew() {
	return (
		<Layout>
			<>
				<Head>
					<title>New Post</title>
				</Head>

				<NewPostCard />
			</>
		</Layout>
	);
}
