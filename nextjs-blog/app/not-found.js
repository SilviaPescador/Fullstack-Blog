'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Layout from '@/components/layout';
import Icon from '@/components/Icons';

export default function NotFound() {
	const t = useTranslations('errors.notFound');

	return (
		<Layout>
			<div className="flex-center flex-col py-8 text-center">
				<Icon name="helpCircle" size={64} style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-md)' }} />
				<h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
					{t('code')}
				</h1>
				<h2 style={{ marginBottom: 'var(--space-sm)' }}>{t('title')}</h2>
				<p className="text-muted mb-6">{t('message')}</p>
				<Link href="/" className="btn btn--primary">
					<Icon name="home" size={16} /> {t('goHome')}
				</Link>
			</div>
		</Layout>
	);
}
