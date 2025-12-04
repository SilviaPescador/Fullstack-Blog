'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UserMenu() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);

			if (user) {
				const { data: profile } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single();
				setProfile(profile);
			}

			setLoading(false);
		};

		getUser();

		// Escuchar cambios en la autenticación
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				supabase
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single()
					.then(({ data }) => setProfile(data));
			} else {
				setProfile(null);
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setShowDropdown(false);
		router.push('/');
		router.refresh();
	};

	if (loading) {
		return (
			<div className="spinner-border spinner-border-sm text-secondary" role="status">
				<span className="visually-hidden">Cargando...</span>
			</div>
		);
	}

	if (!user) {
		return (
			<Link href="/login" className="btn btn-outline-primary btn-sm">
				<i className="bi bi-person me-1"></i>
				Iniciar Sesión
			</Link>
		);
	}

	return (
		<div className="dropdown">
			<button
				className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0"
				type="button"
				onClick={() => setShowDropdown(!showDropdown)}
				aria-expanded={showDropdown}
			>
				{profile?.avatar_url ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={profile.avatar_url}
						alt="Avatar"
						className="rounded-circle"
						style={{ width: '32px', height: '32px', objectFit: 'cover' }}
					/>
				) : (
					<div
						className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
						style={{ width: '32px', height: '32px', fontSize: '14px' }}
					>
						{(profile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
					</div>
				)}
				<span className="d-none d-md-inline text-dark">
					{profile?.full_name || user.email?.split('@')[0]}
				</span>
				<i className="bi bi-chevron-down text-dark"></i>
			</button>

			{showDropdown && (
				<>
					{/* Overlay para cerrar el dropdown al hacer clic fuera */}
					<div
						className="position-fixed top-0 start-0 w-100 h-100"
						style={{ zIndex: 999 }}
						onClick={() => setShowDropdown(false)}
					></div>

					<ul
						className="dropdown-menu dropdown-menu-end show"
						style={{ zIndex: 1000 }}
					>
						<li>
							<span className="dropdown-item-text">
								<small className="text-muted">{user.email}</small>
								{profile?.role === 'admin' && (
									<span className="badge bg-danger ms-2">Admin</span>
								)}
							</span>
						</li>
						<li>
							<hr className="dropdown-divider" />
						</li>
						<li>
							<Link
								href="/profile"
								className="dropdown-item"
								onClick={() => setShowDropdown(false)}
							>
								<i className="bi bi-person me-2"></i>
								Mi Perfil
							</Link>
						</li>
						<li>
							<Link
								href="/my-posts"
								className="dropdown-item"
								onClick={() => setShowDropdown(false)}
							>
								<i className="bi bi-file-text me-2"></i>
								Mis Posts
							</Link>
						</li>
						{profile?.role === 'admin' && (
							<>
								<li>
									<hr className="dropdown-divider" />
								</li>
								<li>
									<Link
										href="/admin/users"
										className="dropdown-item"
										onClick={() => setShowDropdown(false)}
									>
										<i className="bi bi-people me-2"></i>
										Gestionar Usuarios
									</Link>
								</li>
							</>
						)}
						<li>
							<hr className="dropdown-divider" />
						</li>
						<li>
							<button className="dropdown-item text-danger" onClick={handleLogout}>
								<i className="bi bi-box-arrow-right me-2"></i>
								Cerrar Sesión
							</button>
						</li>
					</ul>
				</>
			)}
		</div>
	);
}

