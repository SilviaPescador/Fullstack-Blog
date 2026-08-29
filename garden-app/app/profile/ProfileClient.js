'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';
import { useToast } from '@/components/ToastProvider';
import formatDate from '@/common/formatDate';

export default function ProfileClient({ email, fullName, avatarUrl, createdAt }) {
	const [deleting, setDeleting] = useState(false);
	const router = useRouter();
	const t = useTranslations('profile');
	const { showToast, showConfirm } = useToast();
	const displayName = fullName || email?.split('@')[0] || '';
	const initial = displayName[0]?.toUpperCase() || 'U';

	const handleDelete = async () => {
		const confirmed = await showConfirm({
			title: t('deleteConfirmTitle'),
			message: t('deleteConfirmMessage'),
			confirmText: t('deleteAccount'),
			cancelText: t('deleteCancel'),
			variant: 'danger',
			icon: 'trash',
		});
		if (!confirmed) return;

		setDeleting(true);
		try {
			const res = await fetch('/api/account', { method: 'DELETE' });
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || t('deleteError'));
			}
			showToast('success', t('deleteSuccess'));
			router.push('/');
			router.refresh();
		} catch (error) {
			showToast('error', error.message || t('deleteError'));
			setDeleting(false);
		}
	};

	return (
		<article className="account-page">
			<header className="profile-identity">
				{avatarUrl ? (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img src={avatarUrl} alt="" className="avatar avatar--lg" />
				) : (
					<span className="avatar avatar--lg avatar--placeholder">{initial}</span>
				)}
				<div>
					<h1>{displayName}</h1>
					<p className="text-muted text-sm">{email}</p>
					{createdAt && (
						<p className="profile-since">
							{t('memberSince', { date: formatDate(createdAt) })}
						</p>
					)}
				</div>
			</header>

			<div className="profile-note">
				<Icon name="flower" size={18} />
				<div>
					<p className="profile-note__title">{t('comingSoonTitle')}</p>
					<p>{t('comingSoonBody')}</p>
				</div>
			</div>

			<section className="profile-danger">
				<h2>{t('dangerTitle')}</h2>
				<p>{t('dangerBody')}</p>
				<button
					type="button"
					className="btn btn--outline-danger"
					onClick={handleDelete}
					disabled={deleting}
				>
					{deleting ? (
						<><span className="spinner spinner--sm" /> {t('deleting')}</>
					) : (
						<><Icon name="trash" size={16} /> {t('deleteAccount')}</>
					)}
				</button>
			</section>
		</article>
	);
}
