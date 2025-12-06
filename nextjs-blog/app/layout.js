import { Nunito } from 'next/font/google';
import '../styles/global.css';

const nunito = Nunito({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-nunito',
	weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
	title: 'Spelkit Blog',
	description: 'Blog personal donde se plasman sueños, noticias, emociones e ideas. By Silvia Pescador.',
	icons: {
		icon: '/favicon.ico',
	},
	openGraph: {
		title: 'Spelkit Blog',
		description: 'Blog personal donde se plasman sueños, noticias, emociones e ideas.',
		url: 'https://fullstack-blog-pi.vercel.app',
		siteName: 'Spelkit Blog',
		images: [
			{
				url: '/images/quantum-flower-400.jpg',
				width: 400,
				height: 400,
				alt: 'Spelkit Blog Logo',
			},
		],
		locale: 'es_ES',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Spelkit Blog',
		description: 'Blog personal donde se plasman sueños, noticias, emociones e ideas.',
		images: ['/images/quantum-flower-400.jpg'],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="es" className={nunito.variable}>
			<body>{children}</body>
		</html>
	);
}

