import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Layout from '@/components/layout';
import { AUTHOR_EMAIL, AUTHOR_FULL_NAME, SUPABASE_PRIVACY_URL } from '@/lib/site';

export async function generateMetadata() {
	const t = await getTranslations('privacy');
	return {
		title: t('metaTitle'),
		description: t('metaDescription'),
	};
}

function Section({ title, children }) {
	return (
		<section>
			<h2>{title}</h2>
			{children}
		</section>
	);
}

function ItemList({ items }) {
	return (
		<ul>
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	);
}

export default async function PrivacyPage() {
	const t = await getTranslations('privacy');

	return (
		<Layout>
			<article className="legal-page">
				<h1>{t('title')}</h1>
				<p className="legal-updated">{t('updated')}</p>
				<p>{t('intro')}</p>

				<Section title={t('responsible.title')}>
					<p>{t('responsible.body', { name: AUTHOR_FULL_NAME, email: AUTHOR_EMAIL })}</p>
				</Section>

				<Section title={t('data.title')}>
					<p>{t('data.intro')}</p>
					<p className="legal-subtitle">{t('data.accountTitle')}</p>
					<ItemList items={t.raw('data.account')} />
					<p className="legal-subtitle">{t('data.contentTitle')}</p>
					<ItemList items={t.raw('data.content')} />
					<p className="legal-subtitle">{t('data.techTitle')}</p>
					<ItemList items={t.raw('data.tech')} />
				</Section>

				<Section title={t('purpose.title')}>
					<ItemList items={t.raw('purpose.items')} />
				</Section>

				<Section title={t('processors.title')}>
					<p>{t('processors.intro')}</p>
					<ItemList items={t.raw('processors.items')} />
					<p>
						{t('processors.supabase')}{' '}
						<a href={SUPABASE_PRIVACY_URL} target="_blank" rel="noopener noreferrer">
							{SUPABASE_PRIVACY_URL}
						</a>
					</p>
				</Section>

				<Section title={t('cookies.title')}>
					<p>{t('cookies.body')}</p>
					<ItemList items={t.raw('cookies.items')} />
					<p>{t('cookies.noTracking')}</p>
				</Section>

				<Section title={t('public.title')}>
					<p>{t('public.body')}</p>
				</Section>

				<Section title={t('retention.title')}>
					<p>{t('retention.body')}</p>
				</Section>

				<Section title={t('rights.title')}>
					<p>{t('rights.body', { email: AUTHOR_EMAIL })}</p>
					<ItemList items={t.raw('rights.items')} />
					<p>
						{t.rich('rights.contactLine', {
							contact: (chunks) => <Link href="/contact">{chunks}</Link>,
						})}
					</p>
				</Section>

				<Section title={t('changes.title')}>
					<p>{t('changes.body')}</p>
				</Section>
			</article>
		</Layout>
	);
}
