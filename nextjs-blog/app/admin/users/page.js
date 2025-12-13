'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const router = useRouter();
	const supabase = createClient();
	const t = useTranslations('admin.users');
	const tCommon = useTranslations('common');

	useEffect(() => {
		const checkAdminAndLoadUsers = async () => {
			// Verificar usuario actual
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.push('/login');
				return;
			}

			// Verificar si es admin
			const { data: profile } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (profile?.role !== 'admin') {
				router.push('/');
				return;
			}

			setCurrentUser({ ...user, profile });

			// Cargar todos los usuarios
			const { data: allProfiles, error } = await supabase
				.from('profiles')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) {
				setError(t('loadError'));
				console.error(error);
			} else {
				setUsers(allProfiles || []);
			}

			setLoading(false);
		};

		checkAdminAndLoadUsers();
	}, [supabase, router, t]);

	const updateUserRole = async (userId, newRole) => {
		if (userId === currentUser?.id) {
			setError(t('cantChangeSelf'));
			return;
		}

		setError('');
		setSuccess('');

		const { error } = await supabase
			.from('profiles')
			.update({ role: newRole })
			.eq('id', userId);

		if (error) {
			setError(t('roleError'));
			console.error(error);
		} else {
			setSuccess(t('roleUpdated'));
			// Actualizar lista local
			setUsers(
				users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
			);
		}
	};

	const getRoleBadgeClass = (role) => {
		switch (role) {
			case 'admin':
				return 'bg-danger';
			case 'banned':
				return 'bg-dark';
			default:
				return 'bg-primary';
		}
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center min-vh-100">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">{tCommon('loading')}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">
					<i className="bi bi-people me-2"></i>
					{t('title')}
				</h1>
				<span className="badge bg-secondary">{users.length} {t('count')}</span>
			</div>

			{error && (
				<div className="alert alert-danger alert-dismissible fade show" role="alert">
					{error}
					<button
						type="button"
						className="btn-close"
						onClick={() => setError('')}
					></button>
				</div>
			)}

			{success && (
				<div className="alert alert-success alert-dismissible fade show" role="alert">
					{success}
					<button
						type="button"
						className="btn-close"
						onClick={() => setSuccess('')}
					></button>
				</div>
			)}

			<div className="card shadow-sm">
				<div className="table-responsive">
					<table className="table table-hover mb-0">
						<thead className="table-light">
							<tr>
								<th>{t('columns.user')}</th>
								<th>{t('columns.email')}</th>
								<th>{t('columns.role')}</th>
								<th>{t('columns.registered')}</th>
								<th>{t('columns.actions')}</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									<td>
										<div className="d-flex align-items-center gap-2">
											{user.avatar_url ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={user.avatar_url}
													alt=""
													className="rounded-circle"
													style={{ width: '32px', height: '32px', objectFit: 'cover' }}
												/>
											) : (
												<div
													className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
													style={{ width: '32px', height: '32px', fontSize: '14px' }}
												>
													{(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
												</div>
											)}
											<span>{user.full_name || t('noName')}</span>
										</div>
									</td>
									<td className="text-muted">{user.email}</td>
									<td>
										<span className={`badge ${getRoleBadgeClass(user.role)}`}>
											{user.role}
										</span>
									</td>
									<td className="text-muted">
										{new Date(user.created_at).toLocaleDateString('es-ES')}
									</td>
									<td>
										{user.id === currentUser?.id ? (
											<span className="text-muted small">{t('you')}</span>
										) : (
											<div className="dropdown">
												<button
													className="btn btn-sm btn-outline-secondary dropdown-toggle"
													type="button"
													data-bs-toggle="dropdown"
													aria-expanded="false"
												>
													{t('changeRole')}
												</button>
												<ul className="dropdown-menu">
													<li>
														<button
															className="dropdown-item"
															onClick={() => updateUserRole(user.id, 'user')}
															disabled={user.role === 'user'}
														>
															<i className="bi bi-person me-2"></i>
															{t('roles.user')}
														</button>
													</li>
													<li>
														<button
															className="dropdown-item"
															onClick={() => updateUserRole(user.id, 'admin')}
															disabled={user.role === 'admin'}
														>
															<i className="bi bi-shield me-2"></i>
															{t('roles.admin')}
														</button>
													</li>
													<li>
														<hr className="dropdown-divider" />
													</li>
													<li>
														<button
															className="dropdown-item text-danger"
															onClick={() => updateUserRole(user.id, 'banned')}
															disabled={user.role === 'banned'}
														>
															<i className="bi bi-slash-circle me-2"></i>
															{t('roles.ban')}
														</button>
													</li>
												</ul>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
