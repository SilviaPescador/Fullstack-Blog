'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Layout, { siteTitle } from '@/components/layout';
import PostArticle from '@/components/postArticle';
import Pagination from '@/components/Pagination';
import ErrorMessage from '@/components/ErrorMessage';
import utilStyles from '@/styles/utils.module.css';

// Fetcher mejorado con manejo de errores
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

// Número de posts por página
const POSTS_PER_PAGE = 6;

export default function HomeClient({ initialPosts, initialError }) {
	const [currentPage, setCurrentPage] = useState(1);

	const { data, error, isLoading } = useSWR('/api/posts', fetcher, {
		fallbackData: initialPosts,
		revalidateOnFocus: false,
		shouldRetryOnError: true,
		errorRetryCount: 3,
	});

	// Función para reintentar la carga
	const handleRetry = () => {
		mutate('/api/posts');
	};

	// Mostrar error si falla la carga
	if (error || initialError) {
		const errorMessage = error?.info || initialError?.message || 'Error desconocido';
		const isServerError = error?.status >= 500 || errorMessage.includes('500');
		
		return (
			<Layout home>
				<title>{siteTitle}</title>
				<ErrorMessage
					type={isServerError ? 'server' : 'error'}
					title={isServerError ? 'Error del servidor' : 'No se pudieron cargar los posts'}
					message={
						isServerError
							? 'El servicio no está disponible temporalmente. Por favor, intenta más tarde.'
							: 'Hubo un problema al obtener los posts del blog.'
					}
					details={errorMessage}
					onRetry={handleRetry}
				/>
			</Layout>
		);
	}

	// Mostrar loading mientras carga
	if (isLoading && !data) {
		return (
			<Layout home>
				<title>{siteTitle}</title>
				<div className="d-flex justify-content-center align-items-center py-5">
					<div className="text-center">
						<div className="spinner-border text-primary mb-3" role="status">
							<span className="visually-hidden">Cargando...</span>
						</div>
						<p className="text-muted">Cargando posts...</p>
					</div>
				</div>
			</Layout>
		);
	}

	// Mostrar mensaje si no hay posts
	if (!data || data.length === 0) {
		return (
			<Layout home>
				<title>{siteTitle}</title>
				<ErrorMessage
					type="empty"
					title="No hay posts todavía"
					message="Sé el primero en crear contenido para este blog."
				/>
			</Layout>
		);
	}

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
