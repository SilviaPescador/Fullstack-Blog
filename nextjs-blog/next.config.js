const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// Permitir imágenes de cualquier fuente local
		unoptimized: false,
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
			},
		],
	},
};

module.exports = withNextIntl(nextConfig);
