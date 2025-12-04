'use client';

import useSWR, { mutate } from 'swr';
import Layout, { siteTitle } from '@/components/layout';
import PostArticle from '@/components/postArticle';
import utilStyles from '@/styles/utils.module.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function HomeClient({ initialPosts }) {
	const { data, error } = useSWR('/api/posts', fetcher, {
		fallbackData: initialPosts,
	});

	if (error) return <div>Failed to load</div>;
	if (!data) return <div>Loading...</div>;

	const resetPosts = async () => {
		mutate('/api/posts');
	};

	return (
		<Layout home>
			<title>{siteTitle}</title>
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

