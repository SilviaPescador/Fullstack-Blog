'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useTranslations } from 'next-intl';
import Layout, { siteTitle } from '@/components/layout';
import Garden from '@/components/garden/Garden';
import PostArticle from '@/components/postArticle';
import Pagination from '@/components/Pagination';
import ErrorMessage from '@/components/ErrorMessage';

const fetcher = async (url) => {
	const res = await fetch(url);
	if (!res.ok) {
		const error = new Error('Error al cargar los posts');
		error.status = res.status;
		error.info = await res.text();
		throw error;
	}
	return res.json();
};

const POSTS_PER_PAGE = 6;

export default function HomeClient({ initialPosts, initialError }) {
	const [currentPage, setCurrentPage] = useState(1);
	const t = useTranslations();

	const { data, error, isLoading } = useSWR('/api/posts', fetcher, {
		fallbackData: initialPosts,
		revalidateOnFocus: false,
		shouldRetryOnError: true,
		errorRetryCount: 3,
	});

	const handleRetry = () => mutate('/api/posts');

	if (error || initialError) {
		const errorMessage = error?.info || initialError?.message || 'Error desconocido';
		const isServerError = error?.status >= 500 || errorMessage.includes('500');
		return (
			<Layout home>
				<title>{siteTitle}</title>
				<ErrorMessage
					type={isServerError ? 'server' : 'error'}
					title={isServerError ? t('posts.list.serverError') : t('posts.list.loadError')}
					message={isServerError ? t('posts.list.serverErrorMessage') : t('posts.list.loadErrorMessage')}
					details={errorMessage}
					onRetry={handleRetry}
				/>
			</Layout>
		);
	}

	if (isLoading && !data) {
		return (
			<Layout home>
				<title>{siteTitle}</title>
				<div className="flex-center flex-col py-8">
					<span className="spinner spinner--lg mb-3" />
					<p className="text-muted">{t('posts.list.loading')}</p>
				</div>
			</Layout>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Layout home>
				<title>{siteTitle}</title>
				<section className="garden-section">
					<Garden posts={[]} />
				</section>
				<ErrorMessage type="empty" title={t('posts.list.empty')} message={t('posts.list.emptyMessage')} />
			</Layout>
		);
	}

	const totalPosts = data.length;
	const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
	const currentPosts = data.slice(startIndex, startIndex + POSTS_PER_PAGE);

	return (
		<Layout home>
			<title>{siteTitle}</title>

			{/* The Garden - interactive SVG hero */}
			<section className="garden-section">
				<Garden posts={data} />
			</section>

			{/* Post grid */}
			<section>
				<h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
					{t('garden.latestPosts') || 'Ultimos posts'}
				</h2>
				<div className="post-grid">
					{currentPosts.map((post) => (
						<PostArticle key={post.id} postData={post} onDelete={handleRetry} fullPost={false} home />
					))}
				</div>
			</section>

			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</Layout>
	);
}
