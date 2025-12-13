'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Footer from '@/components/footer';
import UserMenu from '@/components/UserMenu';
import LocaleSwitcher from '@/components/LocaleSwitcher';

import styles from './layout.module.css';
import utilStyles from '@/styles/utils.module.css';

const name = 'Spelkit';
export const siteTitle = 'Spelkit Blog';

export default function Layout({ children, home }) {
	const t = useTranslations();

	return (
		<div className="container card shadow-lg rounded rounded-3 mt-3 p-3 contentBackground">
			{/* Navbar superior */}
			<nav className="d-flex justify-content-between align-items-center mb-3 px-2">
				<Link href="/" className="text-decoration-none">
					<span className="blog-title fs-4 text-dark">{name}</span>
				</Link>
				<div className="d-flex align-items-center gap-3">
					<Link href="/posts/create-new" title={t('nav.createNewPost')} className="btn btn-sm btn-outline-success">
						<i className="bi bi-plus-lg me-1"></i>
						<span className="d-none d-sm-inline">{t('nav.newPost')}</span>
					</Link>
					<LocaleSwitcher />
					<UserMenu />
				</div>
			</nav>

			<header className={styles.header}>
				{home ? (
					<>
						<Link href="/">
							<Image
								priority
								src="/images/quantum-flower-400.jpg"
								className={utilStyles.borderCircle}
								height={144}
								width={144}
								alt={t('metadata.blogLogo')}
							/>
						</Link>
						<h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
					</>
				) : (
					<>
						<Link href="/">
							<Image
								priority
								src="/images/quantum-flower-400.jpg"
								className={utilStyles.borderCircle}
								height={108}
								width={108}
								alt={t('metadata.blogLogo')}
							/>
						</Link>
						<h3 className={utilStyles.headingX1}>
							<Link
								href="/"
								className={utilStyles.colorInherit}
								title={t('metadata.goHome')}
							>
								{name}
							</Link>
						</h3>
					</>
				)}
			</header>

			<main>{children}</main>

			{!home && (
				<div className={styles.backToHome}>
					<Link href="/">{t('common.backToHome')}</Link>
				</div>
			)}

			<Footer />
		</div>
	);
}
