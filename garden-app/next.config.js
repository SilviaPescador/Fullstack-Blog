const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

const securityHeaders = [
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-XSS-Protection', value: '1; mode=block' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
	{
		key: 'Content-Security-Policy',
		value: [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
			"style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
			"font-src 'self' https://cdn.fontshare.com https://fonts.gstatic.com",
			"img-src 'self' data: blob: https://*.supabase.co https://*.googleusercontent.com https://avatars.githubusercontent.com",
			"connect-src 'self' https://*.supabase.co wss://*.supabase.co",
			"frame-ancestors 'none'",
		].join('; '),
	},
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	agentRules: false,
	images: {
		unoptimized: false,
		remotePatterns: [
			{ protocol: 'http', hostname: 'localhost' },
			{ protocol: 'https', hostname: '*.supabase.co' },
		],
	},
	async headers() {
		return [{ source: '/(.*)', headers: securityHeaders }];
	},
};

module.exports = withNextIntl(nextConfig);
