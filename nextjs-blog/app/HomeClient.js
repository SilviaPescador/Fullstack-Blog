'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Layout, { siteTitle } from '@/components/layout';
import PostArticle from '@/components/postArticle';
import Pagination from '@/components/Pagination';
import utilStyles from '@/styles/utils.module.css';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Número de posts por página
const POSTS_PER_PAGE = 6;

export default function HomeClient({ initialPosts }) {
	const [currentPage, setCurrentPage] = useState(1);

	const { data, error } = useSWR('/api/posts', fetcher, {
		fallbackData: initialPosts,
	});

	if (error) return <div>Failed to load</div>;
	if (!data) return <div>Loading...</div>;

	const resetPosts = async () => {
		mutate('/api/posts');
	};

	// Calcular paginación
	const totalPosts = data.length;
	const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
	const endIndex = startIndex + POSTS_PER_PAGE;
	const currentPosts = data.slice(startIndex, endIndex);

	return (
		<Layout home>
			<title>{siteTitle}</title>
			<section className={utilStyles.headingMd}>
				<p className="mx-3 text-center fw-bold">
					Aquí se plasman sueños, noticias, emociones e ideas de célula y metal.
				</p>
			</section>

			{/* Grid de 3 columnas */}
			<section className="pb-4">
				<div className="row g-3">
					{currentPosts.map((post) => (
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

			{/* Paginación */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</Layout>
	);
}
