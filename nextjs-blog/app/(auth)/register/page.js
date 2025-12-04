'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const supabase = createClient();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (password !== confirmPassword) {
			setError('Las contraseñas no coinciden');
			return;
		}

		if (password.length < 6) {
			setError('La contraseña debe tener al menos 6 caracteres');
			return;
		}

		setLoading(true);

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
				},
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			setSuccess(
				'¡Registro exitoso! Revisa tu email para confirmar tu cuenta.'
			);
			setLoading(false);
		}
	};

	const handleOAuthLogin = async (provider) => {
		setError('');
		setLoading(true);

		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
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
						<h2 className="fw-bold">Crear Cuenta</h2>
						<p className="text-muted">Únete a Spelkit Blog</p>
					</div>

					{error && (
						<div className="alert alert-danger" role="alert">
							{error}
						</div>
					)}

					{success && (
						<div className="alert alert-success" role="alert">
							{success}
						</div>
					)}

					<form onSubmit={handleRegister}>
						<div className="mb-3">
							<label htmlFor="fullName" className="form-label">
								Nombre completo
							</label>
							<input
								type="text"
								className="form-control"
								id="fullName"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
								disabled={loading}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								Email
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
								Contraseña
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
								minLength={6}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="confirmPassword" className="form-label">
								Confirmar contraseña
							</label>
							<input
								type="password"
								className="form-control"
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
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
									Registrando...
								</>
							) : (
								'Crear Cuenta'
							)}
						</button>
					</form>

					<div className="text-center my-3">
						<span className="text-muted">o regístrate con</span>
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
						¿Ya tienes cuenta?{' '}
						<Link href="/login" className="text-primary">
							Inicia sesión
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

