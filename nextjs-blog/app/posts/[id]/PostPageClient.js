'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Layout from '@/components/layout';
import PostService from '@/services/postService';
import PostArticle from '@/components/postArticle';
import ErrorMessage from '@/components/ErrorMessage';

export default function PostPageClient({ initialPost, postId, initialError }) {
	const [postData, setPostData] = useState(initialPost);
	const [edited, setIsEdited] = useState(false);
	const [error, setError] = useState(initialError);
	const [loading, setLoading] = useState(false);
	const t = useTranslations();

	const fetchPostData = async () => {
		setLoading(true);
		setError(null);
		try {
			const postService = new PostService();
			const response = await postService.getPosts(postId);
			setPostData(response);
		} catch (err) {
			console.error(err);
			setError({ message: err.message || t('posts.view.loadError') });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (edited) {
			fetchPostData();
			setIsEdited(false);
		}
	}, [postId, edited]);

	// Mostrar error
	if (error) {
		return (
			<Layout>
				<ErrorMessage
					type="server"
					title={t('posts.view.loadError')}
					message={t('posts.view.loadErrorMessage')}
					details={error.message}
					onRetry={fetchPostData}
					showHomeLink
				/>
			</Layout>
		);
	}

	// Mostrar loading
	if (loading) {
		return (
			<Layout>
				<div className="d-flex justify-content-center align-items-center py-5">
					<div className="text-center">
						<div className="spinner-border text-primary mb-3" role="status">
							<span className="visually-hidden">{t('common.loading')}</span>
						</div>
						<p className="text-muted">{t('posts.view.loadingPost')}</p>
					</div>
				</div>
			</Layout>
		);
	}

	if (!postData) {
		return (
			<Layout>
				<ErrorMessage
					type="empty"
					title={t('posts.view.notAvailable')}
					message={t('posts.view.notAvailableMessage')}
					showHomeLink
				/>
			</Layout>
		);
	}

	return (
		<Layout>
			<PostArticle postData={postData} setIsEdited={setIsEdited} fullPost />
		</Layout>
	);
}
