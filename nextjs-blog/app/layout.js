 import { Nunito } from 'next/font/google';
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
				alt: 'Spelkit Blog Logo',
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

export default function RootLayout({ children }) {
	return (
		<html lang="es" className={nunito.variable}>
			<body>{children}</body>
		</html>
	);
}

