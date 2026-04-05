import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Particles from '@/components/Particles';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import ToastProvider from '@/components/ToastProvider';
import '../styles/tokens.css';
import '../styles/global.css';
import '../styles/garden.css';

const siteUrl = 'https://fullstack-blog-beta.vercel.app';

export const metadata = {
	title: 'Our Garden',
	description: 'Un espacio vivo que crece con la comunidad. Cada post aprobado hace crecer el jardin.',
	icons: { icon: '/favicon.ico' },
	metadataBase: new URL(siteUrl),
	openGraph: {
		title: 'Our Garden',
		description: 'Un espacio vivo que crece con la comunidad.',
		url: siteUrl,
		siteName: 'Our Garden',
		locale: 'es_ES',
		type: 'website',
	},
};

export default async function RootLayout({ children }) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} data-theme="dark" suppressHydrationWarning>
			<head>
				<link
					href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap"
					rel="stylesheet"
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme:light)').matches)document.documentElement.setAttribute('data-theme','light')}catch(e){}})()`,
					}}
				/>
			</head>
			<body>
				<CursorGlow />
				<Particles />
				<NextIntlClientProvider messages={messages}>
					<ToastProvider>
						<Navbar />
						{children}
					</ToastProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
