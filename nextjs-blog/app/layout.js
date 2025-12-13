import { Nunito } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import '../styles/global.css';

const nunito = Nunito({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-nunito',
	weight: ['300', '400', '500', '600', '700', '800'],
});

const siteUrl = 'https://fullstack-blog-beta.vercel.app';

export const metadata = {
	title: 'Spelkit Blog',
	description: 'Blog personal donde se plasman sueños, noticias, emociones e ideas. By Silvia Pescador.',
	icons: {
		icon: '/favicon.ico',
	},
	metadataBase: new URL(siteUrl),
	openGraph: {
		title: 'Spelkit',
		description: 'Blog personal donde se plasman sueños, noticias, emociones e ideas ✨',
		url: siteUrl,
		siteName: 'Spelkit Blog',
		images: [
			{
				url: `${siteUrl}/images/quantum-flower-400.jpg`,
				width: 400,
				height: 400,
				alt: 'Logo de Spelkit Blog',
			},
		],
		locale: 'es_ES',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Spelkit',
		description: 'Blog personal donde se plasman sueños, noticias, emociones e ideas ✨',
		images: [`${siteUrl}/images/quantum-flower-400.jpg`],
	},
};

export default async function RootLayout({ children }) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className={nunito.variable}>
			<body>
				<NextIntlClientProvider messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
