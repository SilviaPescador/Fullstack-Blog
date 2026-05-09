'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Layout from '@/components/layout';
import Icon from '@/components/Icons';

export default function Error({ error, reset }) {
	const t = useTranslations('errors.generic');

	useEffect(() => {
		console.error('Application error:', error);
	}, [error]);

	return (
		<Layout>
			<div className="flex-center flex-col py-8 text-center">
				<Icon name="alertTriangle" size={64} style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-md)' }} />
				<h1 style={{ marginBottom: 'var(--space-sm)' }}>{t('title')}</h1>
				<p className="text-muted mb-4">{t('message')}</p>

				{process.env.NODE_ENV === 'development' && error?.message && (
					<div className="alert alert--danger mb-4 text-mono text-sm" style={{ maxWidth: '500px' }}>
						{error.message}
					</div>
				)}

				<div className="flex gap-3">
					<button onClick={() => reset()} className="btn btn--primary">
						<Icon name="refresh" size={16} /> {t('retry')}
					</button>
					<a href="/" className="btn btn--outline">
						<Icon name="home" size={16} /> {t('goHome')}
					</a>
				</div>
			</div>
		</Layout>
	);
}
