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
			{/* Grid de 3 columnas */}
			<section className="pb-5">
				<div className="row g-3">
					{data.map((post) => (
						<div className="col-12 col-md-6 col-lg-4" key={post.id}>
							<PostArticle
								postData={post}
								onDelete={resetPosts}
								fullPost={false}
								home
							/>
						</div>
					))}
				</div>
			</section>
		</Layout>
	);
}

