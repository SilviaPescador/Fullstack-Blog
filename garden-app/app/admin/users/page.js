'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { PROFILE_PUBLIC_COLUMNS } from '@/lib/validation';
import Icon from '@/components/Icons';

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [openDropdown, setOpenDropdown] = useState(null);
	const router = useRouter();
	const supabase = createClient();
	const t = useTranslations('admin.users');
	const tCommon = useTranslations('common');

	useEffect(() => {
		const init = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { router.push('/login'); return; }
			const { data: profile } = await supabase.from('profiles').select(PROFILE_PUBLIC_COLUMNS).eq('id', user.id).single();
			if (profile?.role !== 'admin') { router.push('/'); return; }
			setCurrentUser({ ...user, profile });
			const { data: allProfiles, error } = await supabase.rpc('admin_list_profiles');
			if (error) { setError(t('loadError')); } else { setUsers(allProfiles || []); }
			setLoading(false);
		};
		init();
	}, [supabase, router, t]);

	const updateUserRole = async (userId, newRole) => {
		if (userId === currentUser?.id) { setError(t('cantChangeSelf')); return; }
		setError(''); setSuccess('');
		const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
		if (error) { setError(t('roleError')); }
		else { setSuccess(t('roleUpdated')); setUsers(users.map((u) => u.id === userId ? { ...u, role: newRole } : u)); }
		setOpenDropdown(null);
	};

	const roleBadge = (role) => {
		if (role === 'admin') return 'badge--danger';
		if (role === 'banned') return 'badge--muted';
		return 'badge--success';
	};

	if (loading) {
		return <div className="flex-center min-h-screen"><span className="spinner spinner--lg" /></div>;
	}

	return (
		<div className="container py-4">
			<div className="flex-between mb-6">
				<h1 className="flex items-center gap-3">
					<Icon name="users" size={24} /> {t('title')}
				</h1>
				<span className="badge badge--muted">{users.length} {t('count')}</span>
			</div>

			{error && <div className="alert alert--danger mb-4">{error} <button className="btn btn--ghost btn--sm ml-2" onClick={() => setError('')}><Icon name="x" size={14} /></button></div>}
			{success && <div className="alert alert--success mb-4">{success} <button className="btn btn--ghost btn--sm ml-2" onClick={() => setSuccess('')}><Icon name="x" size={14} /></button></div>}

			<div className="table-wrap">
				<table className="table">
					<thead>
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
									<div className="flex items-center gap-3">
										{user.avatar_url ? (
											/* eslint-disable-next-line @next/next/no-img-element */
											<img src={user.avatar_url} alt="" className="avatar" />
										) : (
											<span className="avatar avatar--placeholder">
												{(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
											</span>
										)}
										<span>{user.full_name || t('noName')}</span>
									</div>
								</td>
								<td className="text-muted">{user.email}</td>
								<td><span className={`badge ${roleBadge(user.role)}`}>{user.role}</span></td>
								<td className="text-muted">{new Date(user.created_at).toLocaleDateString('es-ES')}</td>
								<td>
									{user.id === currentUser?.id ? (
										<span className="text-muted text-sm">{t('you')}</span>
									) : (
										<div className="dropdown">
											<button className="btn btn--outline btn--sm" onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}>
												{t('changeRole')} <Icon name="chevronDown" size={14} />
											</button>
											{openDropdown === user.id && (
												<>
													<div className="overlay" onClick={() => setOpenDropdown(null)} />
													<ul className="dropdown__menu">
														<li><button className="dropdown__item" onClick={() => updateUserRole(user.id, 'user')} disabled={user.role === 'user'}><Icon name="user" size={14} /> {t('roles.user')}</button></li>
														<li><button className="dropdown__item" onClick={() => updateUserRole(user.id, 'admin')} disabled={user.role === 'admin'}><Icon name="shield" size={14} /> {t('roles.admin')}</button></li>
														<li><div className="dropdown__divider" /></li>
														<li><button className="dropdown__item dropdown__item--danger" onClick={() => updateUserRole(user.id, 'banned')} disabled={user.role === 'banned'}><Icon name="ban" size={14} /> {t('roles.ban')}</button></li>
													</ul>
												</>
											)}
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
