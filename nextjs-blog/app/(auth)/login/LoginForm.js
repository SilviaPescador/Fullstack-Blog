'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirectTo') || '/';
	const t = useTranslations('auth.login');

	const supabase = createClient();

	const handleEmailLogin = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			router.push(redirectTo);
			router.refresh();
		}
	};

	const handleOAuthLogin = async (provider) => {
		setError('');
		setLoading(true);

		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
			},
		});

		if (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
			<div className="card shadow-lg" style={{ maxWidth: '420px', width: '100%' }}>
				<div className="card-body p-5">
					<div className="text-center mb-4">
						<h2 className="fw-bold">{t('title')}</h2>
						<p className="text-muted">{t('welcome')}</p>
					</div>

					{error && (
						<div className="alert alert-danger" role="alert">
							{error}
						</div>
					)}

					<form onSubmit={handleEmailLogin}>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								{t('email')}
							</label>
							<input
								type="email"
								className="form-control"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								{t('password')}
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
							/>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-100 mb-3"
							disabled={loading}
						>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2"></span>
									{t('loading')}
								</>
							) : (
								t('submit')
							)}
						</button>
					</form>

					<div className="text-center my-3">
						<span className="text-muted">{t('orContinueWith')}</span>
					</div>

					<div className="d-grid gap-2">
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleOAuthLogin('google')}
							disabled={loading}
						>
							<i className="bi bi-google me-2"></i>
							Google
						</button>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleOAuthLogin('github')}
							disabled={loading}
						>
							<i className="bi bi-github me-2"></i>
							GitHub
						</button>
					</div>

					<hr className="my-4" />

					<p className="text-center mb-0">
						{t('noAccount')}{' '}
						<Link href="/register" className="text-primary">
							{t('register')}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
