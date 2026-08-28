'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/Icons';

export default function BannedPage() {
	const router = useRouter();
	const supabase = createClient();
	const t = useTranslations('auth.banned');
	const tNav = useTranslations('nav');

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push('/');
		router.refresh();
	};

	return (
		<div className="auth-page">
			<div className="auth-card text-center">
				<Icon name="ban" size={64} style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-md)' }} />
				<h2 style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-sm)' }}>{t('title')}</h2>
				<p className="text-muted mb-6">
					{t.rich('message', {
						contact: (chunks) => <Link href="/contact">{chunks}</Link>,
					})}
				</p>
				<button onClick={handleLogout} className="btn btn--outline">
					<Icon name="logOut" size={16} /> {tNav('logout')}
				</button>
			</div>
		</div>
	);
}
