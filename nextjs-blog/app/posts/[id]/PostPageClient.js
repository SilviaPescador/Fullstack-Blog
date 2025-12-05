'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import PostService from '@/services/postService';
import PostArticle from '@/components/postArticle';
import ErrorMessage from '@/components/ErrorMessage';

export default function PostPageClient({ initialPost, postId, initialError }) {
	const [postData, setPostData] = useState(initialPost);
	const [edited, setIsEdited] = useState(false);
	const [error, setError] = useState(initialError);
	const [loading, setLoading] = useState(false);

	const fetchPostData = async () => {
		setLoading(true);
		setError(null);
		try {
			const postService = new PostService();
			const response = await postService.getPosts(postId);
			setPostData(response);
		} catch (err) {
			console.error(err);
			setError({ message: err.message || 'Error al cargar el post' });
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
					title="Error al cargar el post"
					message="No se pudo obtener la información del post. Por favor, intenta más tarde."
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
							<span className="visually-hidden">Cargando...</span>
						</div>
						<p className="text-muted">Cargando post...</p>
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
					title="Post no disponible"
					message="El post que buscas no existe o ha sido eliminado."
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

