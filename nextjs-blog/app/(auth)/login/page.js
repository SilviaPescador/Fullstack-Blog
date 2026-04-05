'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

function LoginFallback() {
	return (
		<div className="auth-page">
			<span className="spinner spinner--lg" />
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
