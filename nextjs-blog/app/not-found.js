'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Layout from '@/components/layout';

export default function NotFound() {
	const t = useTranslations('errors.notFound');

	return (
		<Layout>
			<div className="d-flex flex-column align-items-center justify-content-center py-5">
				<div className="text-center">
					{/* Icono grande */}
					<i className="bi bi-question-circle text-warning" style={{ fontSize: '6rem' }}></i>
					
					{/* Código de error */}
					<h1 className="display-1 fw-bold text-muted mt-3">{t('code')}</h1>
					
					{/* Mensaje principal */}
					<h2 className="h4 text-dark mb-3">{t('title')}</h2>
					
					{/* Descripción */}
					<p className="text-muted mb-4 px-3">
						{t('message')}
					</p>
					
					{/* Botón de regreso */}
					<Link href="/" className="btn btn-primary px-4 py-2">
						<i className="bi bi-house-door me-2"></i>
						{t('goHome')}
					</Link>
				</div>
			</div>
		</Layout>
	);
}
