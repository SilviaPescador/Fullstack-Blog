'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import LoginForm from './LoginForm';

function LoginFallback() {
	const t = useTranslations('common');
	
	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
			<div className="spinner-border text-primary" role="status">
				<span className="visually-hidden">{t('loading')}</span>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<LoginFallback />}>
			<LoginForm />
		</Suspense>
	);
}
