'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useTranslations } from 'next-intl';
import Layout, { siteTitle } from '@/components/layout';
import Garden from '@/components/garden/Garden';
import PostArticle from '@/components/postArticle';
import PostSearch from '@/components/PostSearch';
import ErrorMessage from '@/components/ErrorMessage';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

const POSTS_PER_PAGE = 9;

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
	const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
	const [query, setQuery] = useState('');
	const t = useTranslations();
	const { user, loading: authLoading } = useAuth();
	const prevUserId = useRef(undefined);
	const [newPostIds, setNewPostIds] = useState([]);

	const { data, error, isLoading } = useSWR('/api/posts', fetcher, {
		fallbackData: initialPosts,
		revalidateOnFocus: false,
		revalidateOnMount: false,
		shouldRetryOnError: true,
		errorRetryCount: 3,
	});

	useEffect(() => {
		if (authLoading) return;
		const next = user?.id ?? null;
		if (prevUserId.current === undefined) {
			prevUserId.current = next;
			return;
		}
		if (prevUserId.current !== next) {
			prevUserId.current = next;
			mutate('/api/posts');
		}
	}, [authLoading, user?.id]);

	useEffect(() => {
		const supabase = createClient();
		const channel = supabase
			.channel('garden-realtime')
			.on('postgres_changes', {
				event: 'UPDATE',
				schema: 'public',
				table: 'posts',
				filter: 'status=eq.approved',
			}, (payload) => {
				const updated = payload.new;
				mutate('/api/posts', (current) => {
					if (!current) return current;
					const exists = current.find((p) => p.id === updated.id);
					if (exists) {
						return current.map((p) => p.id === updated.id
							? { ...p, water_count: updated.water_count ?? p.water_count }
							: p);
					}
					setNewPostIds((ids) => ids.includes(updated.id) ? ids : [...ids, updated.id]);
					return [...current, {
						id: updated.id,
						title: updated.title,
						content: updated.content,
						image: updated.image_url,
						author: 'Nuevo',
						author_id: updated.author_id,
						post_date: updated.created_at,
						created_at: updated.created_at,
						visual_dna: updated.visual_dna,
						water_count: updated.water_count || 0,
						watered_by_me: false,
					}];
				}, false);
			})
			.subscribe();

		return () => { supabase.removeChannel(channel); };
	}, []);

	const handleRetry = () => mutate('/api/posts');

	const handleWater = (postId, newCount, wateredByMe) => {
		mutate(
			'/api/posts',
			(current) => current?.map((p) => p.id === postId
				? { ...p, water_count: newCount, watered_by_me: wateredByMe }
				: p),
			false
		);
	};

	const handleQueryChange = (value) => {
		setQuery(value);
		setVisibleCount(POSTS_PER_PAGE);
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
	const listPosts = filteredPosts.slice(0, visibleCount);
	const hasMore = filteredPosts.length > visibleCount;

	return (
		<Layout home>
			<title>{siteTitle}</title>

			<section className="garden-section">
				<Garden posts={data} newPostIds={newPostIds} />
			</section>

			<section>
				<div className="posts-toolbar">
					<h2>
						{isSearching
							? t('posts.search.results', { count: filteredPosts.length })
							: (t('garden.latestPosts') || 'Ultimos posts')}
					</h2>
					<PostSearch value={query} onChange={handleQueryChange} />
				</div>
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
				{hasMore && (
					<div className="posts-more">
						<button
							type="button"
							className="btn btn--outline"
							onClick={() => setVisibleCount((n) => n + POSTS_PER_PAGE)}
						>
							{t('posts.list.showMore')}
						</button>
					</div>
				)}
			</section>
		</Layout>
	);
}
