'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { MIN_PASSWORD_LENGTH } from '@/lib/validation';
import Icon from '@/components/Icons';

export default function RegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const t = useTranslations('auth.register');
	const supabase = createClient();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		if (password !== confirmPassword) { setError(t('passwordMismatch')); return; }
		if (password.length < MIN_PASSWORD_LENGTH) { setError(t('passwordTooShort')); return; }
		setLoading(true);
		const { error } = await supabase.auth.signUp({
			email, password,
			options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` },
		});
		if (error) { setError(error.message); } else { setSuccess(t('success')); }
		setLoading(false);
	};

	const handleOAuthLogin = async (provider) => {
		setError('');
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${window.location.origin}/auth/callback` },
		});
		if (error) { setError(error.message); setLoading(false); }
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<div className="text-center mb-6">
					<h2>{t('title')}</h2>
					<p className="text-muted mt-2">{t('subtitle')}</p>
				</div>

				{error && <div className="alert alert--danger mb-4">{error}</div>}
				{success && <div className="alert alert--success mb-4">{success}</div>}

				<form onSubmit={handleRegister}>
					<div className="form-group">
						<label htmlFor="fullName">{t('fullName')}</label>
						<input type="text" id="fullName" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} />
					</div>
					<div className="form-group">
						<label htmlFor="email">{t('email')}</label>
						<input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
					</div>
					<div className="form-group">
						<label htmlFor="password">{t('password')}</label>
						<input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} minLength={MIN_PASSWORD_LENGTH} />
					</div>
					<div className="form-group">
						<label htmlFor="confirmPassword">{t('confirmPassword')}</label>
						<input type="password" id="confirmPassword" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
					</div>
					<button type="submit" className="btn btn--primary btn--full mb-4" disabled={loading}>
						{loading ? <><span className="spinner spinner--sm mr-2" /> {t('loading')}</> : t('submit')}
					</button>
				</form>

				<div className="text-center text-muted text-sm mb-4">{t('orRegisterWith')}</div>

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
					{t('hasAccount')}{' '}
					<Link href="/login" className="text-accent font-medium">{t('login')}</Link>
				</p>
			</div>
		</div>
	);
}
