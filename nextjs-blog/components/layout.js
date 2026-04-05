'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Footer from '@/components/footer';
import UserMenu from '@/components/UserMenu';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import Icon from '@/components/Icons';

import styles from './layout.module.css';
import utilStyles from '@/styles/utils.module.css';

export const siteTitle = 'Our Garden';

function NavLogo() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M12 22c0-4-2-7-5-9 3-1 5-4 5-7 0 3 2 6 5 7-3 2-5 5-5 9z" fill="var(--color-accent-green)" opacity="0.8" />
			<path d="M12 18c0-2.5-1.5-4.5-3.5-5.5 2-.8 3.5-2.5 3.5-4.5 0 2 1.5 3.7 3.5 4.5C13.5 13.5 12 15.5 12 18z" fill="var(--color-accent-teal)" opacity="0.6" />
			<circle cx="12" cy="6" r="2" fill="var(--color-accent-green)" opacity="0.9" />
			<line x1="12" y1="8" x2="12" y2="22" stroke="var(--color-accent-green)" strokeWidth="1.5" opacity="0.5" />
		</svg>
	);
}

export default function Layout({ children, home }) {
	const t = useTranslations();

	return (
		<div className={styles.siteWrapper}>
			<nav className={styles.nav}>
				<Link href="/" className={styles.navBrand} aria-label="Our Garden - Home">
					<NavLogo />
				</Link>
				<div className={styles.navActions}>
					<Link href="/posts/create-new" className="btn btn--outline btn--sm" title={t('nav.createNewPost')}>
						<Icon name="plus" size={16} />
						<span className="hidden sm:inline">{t('nav.newPost')}</span>
					</Link>
					<LocaleSwitcher />
					<ThemeToggle />
					<UserMenu />
				</div>
			</nav>

			{home && (
				<header className={styles.header}>
					<Link href="/">
						<Image
							priority
							src="/images/quantum-flower-400.jpg"
							className={utilStyles.borderCircle}
							height={120}
							width={120}
							alt={t('metadata.blogLogo')}
						/>
					</Link>
					<h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
					<p className="text-muted" style={{ marginTop: 'var(--space-xs)' }}>
						{t('garden.subtitle')}
					</p>
				</header>
			)}

			<main className={styles.main}>{children}</main>

			{!home && (
				<div className={styles.backToHome}>
					<Link href="/">&larr; {t('common.backToHome')}</Link>
				</div>
			)}

			<Footer />
		</div>
	);
}
