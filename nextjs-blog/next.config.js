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

module.exports = nextConfig;
