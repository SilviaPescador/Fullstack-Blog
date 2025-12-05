'use client';

import { useEffect } from 'react';
import Layout from '@/components/layout';

export default function Error({ error, reset }) {
	useEffect(() => {
		// Log del error para debugging
		console.error('Error de aplicación:', error);
	}, [error]);

	return (
		<Layout>
			<div className="d-flex flex-column align-items-center justify-content-center py-5">
				<div className="text-center">
					{/* Icono de error */}
					<i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '6rem' }}></i>
					
					{/* Título */}
					<h1 className="h2 text-dark mt-4 mb-3">¡Oops! Algo salió mal</h1>
					
					{/* Descripción */}
					<p className="text-muted mb-2">
						Ha ocurrido un error inesperado en la aplicación.
					</p>
					
					{/* Detalle del error (solo en desarrollo) */}
					{process.env.NODE_ENV === 'development' && error?.message && (
						<div className="alert alert-danger mx-auto mt-3" style={{ maxWidth: '500px' }}>
							<small className="font-monospace">{error.message}</small>
						</div>
					)}
					
					{/* Botones de acción */}
					<div className="d-flex gap-3 justify-content-center mt-4">
						<button
							onClick={() => reset()}
							className="btn btn-primary px-4"
						>
							<i className="bi bi-arrow-clockwise me-2"></i>
							Intentar de nuevo
						</button>
						<a href="/" className="btn btn-outline-secondary px-4">
							<i className="bi bi-house-door me-2"></i>
							Ir al inicio
						</a>
					</div>
				</div>
			</div>
		</Layout>
	);
}

