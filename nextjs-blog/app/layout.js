import '../styles/global.css';

export const metadata = {
	title: 'Spelkit Blog',
	description: 'Personal Blog - By Silvia Pescador',
	icons: {
		icon: '/favicon.ico',
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="es">
			<body>{children}</body>
		</html>
	);
}

