'use client';

import { useMemo, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useTranslations } from 'next-intl';
import Layout, { siteTitle } from '@/components/layout';
import Garden from '@/components/garden/Garden';
import PostArticle from '@/components/postArticle';
import PostSearch from '@/components/PostSearch';
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

function normalizeSearchText(text) {
	return (text || '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

export default function HomeClient({ initialPosts, initialError }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [query, setQuery] = useState('');
	const pageBeforeSearch = useRef(1);
	const t = useTranslations();

	const { data, error, isLoading } = useSWR('/api/posts', fetcher, {
		fallbackData: initialPosts,
		revalidateOnFocus: false,
		shouldRetryOnError: true,
		errorRetryCount: 3,
	});

	const handleRetry = () => mutate('/api/posts');

	const handleWater = (postId, newCount) => {
		mutate(
			'/api/posts',
			(current) => current?.map(p => p.id === postId ? { ...p, water_count: newCount } : p),
			false
		);
	};

	const handleQueryChange = (value) => {
		const wasSearching = query.trim() !== '';
		const isSearching = value.trim() !== '';

		if (!wasSearching && isSearching) {
			pageBeforeSearch.current = currentPage;
			setCurrentPage(1);
		} else if (wasSearching && !isSearching) {
			setCurrentPage(pageBeforeSearch.current);
		}

		setQuery(value);
	};

	const filteredPosts = useMemo(() => {
		if (!data) return [];
		const q = normalizeSearchText(query);
		if (!q) return data;
		return data.filter((post) => {
			const title = normalizeSearchText(post.title);
			const content = normalizeSearchText(post.content);
			const author = normalizeSearchText(post.author);
			return title.includes(q) || content.includes(q) || author.includes(q);
		});
	}, [data, query]);

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

	const isSearching = query.trim().length > 0;
	const listPosts = isSearching
		? filteredPosts
		: filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
	const totalPages = Math.ceil(data.length / POSTS_PER_PAGE);

	return (
		<Layout home>
			<title>{siteTitle}</title>

			<section className="garden-section">
				<Garden posts={data} />
			</section>

			<PostSearch value={query} onChange={handleQueryChange} />

			<section>
				<h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
					{isSearching
						? t('posts.search.results', { count: filteredPosts.length })
						: (t('garden.latestPosts') || 'Ultimos posts')}
				</h2>
				<div className="sr-only" aria-live="polite">
					{isSearching ? t('posts.search.results', { count: filteredPosts.length }) : ''}
				</div>
				{listPosts.length === 0 ? (
					<ErrorMessage
						type="empty"
						title={t('posts.search.empty')}
						message={t('posts.search.emptyMessage')}
					/>
				) : (
					<div className="post-grid">
						{listPosts.map((post) => (
							<PostArticle key={post.id} postData={post} onDelete={handleRetry} onWater={handleWater} fullPost={false} home />
						))}
					</div>
				)}
			</section>

			{!isSearching && (
				<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
			)}
		</Layout>
	);
}
