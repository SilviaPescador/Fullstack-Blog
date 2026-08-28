import { getTranslations } from 'next-intl/server';
import Layout from '@/components/layout';
import Icon from '@/components/Icons';
import {
	AUTHOR_EMAIL,
	AUTHOR_URL,
	GITHUB_PROFILE,
	GITHUB_REPO,
} from '@/lib/site';

export async function generateMetadata() {
	const t = await getTranslations('contact');
	return {
		title: t('metaTitle'),
		description: t('metaDescription'),
	};
}

export default async function ContactPage() {
	const t = await getTranslations('contact');

	return (
		<Layout>
			<article className="legal-page">
				<h1>{t('title')}</h1>
				<p className="legal-lead">{t('heading')}</p>
				<p>{t('body')}</p>

				<div className="contact-actions">
					<a href={`mailto:${AUTHOR_EMAIL}`} className="btn btn--primary">
						<Icon name="send" size={16} />
						{t('cta')}
					</a>
					<p className="text-sm text-muted">{AUTHOR_EMAIL}</p>
				</div>

				<div className="contact-socials">
					<a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
					<span aria-hidden="true">·</span>
					<a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
						The Garden
					</a>
					<span aria-hidden="true">·</span>
					<a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
						silviapescador.com
					</a>
				</div>
			</article>
		</Layout>
	);
}
