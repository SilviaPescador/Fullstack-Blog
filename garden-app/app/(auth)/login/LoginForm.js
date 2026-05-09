'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/Icons';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const rawRedirect = searchParams.get('redirectTo') || '/';
	const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/';
	const t = useTranslations('auth.login');
	const supabase = createClient();

	const handleEmailLogin = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) { setError(error.message); setLoading(false); }
		else { router.push(redirectTo); router.refresh(); }
	};

	const handleOAuthLogin = async (provider) => {
		setError('');
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}` },
		});
		if (error) { setError(error.message); setLoading(false); }
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<div className="text-center mb-6">
					<h2>{t('title')}</h2>
					<p className="text-muted mt-2">{t('welcome')}</p>
				</div>

				{error && <div className="alert alert--danger mb-4">{error}</div>}

				<form onSubmit={handleEmailLogin}>
					<div className="form-group">
						<label htmlFor="email">{t('email')}</label>
						<input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
					</div>
					<div className="form-group">
						<label htmlFor="password">{t('password')}</label>
						<input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
					</div>
					<button type="submit" className="btn btn--primary btn--full mb-4" disabled={loading}>
						{loading ? <><span className="spinner spinner--sm mr-2" /> {t('loading')}</> : t('submit')}
					</button>
				</form>

				<div className="text-center text-muted text-sm mb-4">{t('orContinueWith')}</div>

				<div className="flex-col gap-3">
					<button className="btn btn--outline btn--full" onClick={() => handleOAuthLogin('google')} disabled={loading}>
						<Icon name="google" size={18} /> Google
					</button>
					<button className="btn btn--outline btn--full" onClick={() => handleOAuthLogin('github')} disabled={loading}>
						<Icon name="github" size={18} /> GitHub
					</button>
				</div>

				<hr />

				<p className="text-center text-sm">
					{t('noAccount')}{' '}
					<Link href="/register" className="text-accent font-medium">{t('register')}</Link>
				</p>
			</div>
		</div>
	);
}
