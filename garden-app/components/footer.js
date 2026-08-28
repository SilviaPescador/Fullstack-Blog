'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';
import { AUTHOR_NAME, AUTHOR_URL, GITHUB_REPO } from '@/lib/site';
import styles from './footer.module.css';

export default function Footer() {
	const t = useTranslations('footer');

	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
				<p className={styles.credit}>
					<span className={styles.brace}>{'{'}</span>
					{t('designedBy')}{' '}
					<a
						href={AUTHOR_URL}
						className={styles.author}
						target="_blank"
						rel="noopener noreferrer"
					>
						{AUTHOR_NAME}
					</a>
					<span className={styles.brace}>{'}'}</span>
				</p>

				<nav className={styles.links} aria-label={t('navLabel')}>
					<Link href="/privacy" className={styles.link}>{t('privacy')}</Link>
					<span className={styles.sep} aria-hidden="true">·</span>
					<Link href="/contact" className={styles.link}>{t('contact')}</Link>
				</nav>

				<a
					href={GITHUB_REPO}
					className={styles.github}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={t('github')}
					title={t('github')}
				>
					<Icon name="github" size={18} />
				</a>
			</div>
		</footer>
	);
}
