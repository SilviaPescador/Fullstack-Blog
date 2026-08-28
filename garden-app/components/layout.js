'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Footer from '@/components/footer';

import styles from './layout.module.css';
import utilStyles from '@/styles/utils.module.css';

export const siteTitle = 'The Garden';

export default function Layout({ children, home }) {
	const t = useTranslations();

	return (
		<div className={styles.siteWrapper}>
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
					<p className={`${styles.subtitle} text-muted`}>
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
