'use client';

import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';

const typeConfig = {
	error:   { icon: 'alertTriangle', color: 'var(--color-danger)' },
	warning: { icon: 'alertTriangle', color: 'var(--color-warning)' },
	info:    { icon: 'info',          color: 'var(--color-info)' },
	empty:   { icon: 'inbox',         color: 'var(--color-text-muted)' },
	offline: { icon: 'wifiOff',       color: 'var(--color-text-muted)' },
	server:  { icon: 'server',        color: 'var(--color-danger)' },
};

export default function ErrorMessage({ type = 'error', title, message, details, onRetry, showHomeLink = false }) {
	const t = useTranslations('errors.types');
	const tCommon = useTranslations('common');

	const { icon, color } = typeConfig[type] || typeConfig.error;
	const defaultTitle = t(`${type}.title`);
	const defaultMessage = t(`${type}.message`);

	return (
		<div className="flex-center flex-col py-8 text-center">
			<Icon name={icon} size={48} style={{ color, marginBottom: 'var(--space-md)' }} />
			<h3 style={{ marginBottom: 'var(--space-xs)' }}>{title || defaultTitle}</h3>
			<p className="text-muted" style={{ maxWidth: '400px', marginBottom: 'var(--space-md)' }}>
				{message || defaultMessage}
			</p>

			{process.env.NODE_ENV === 'development' && details && (
				<div className="alert alert--warning mb-4 text-mono text-sm" style={{ maxWidth: '400px' }}>
					{details}
				</div>
			)}

			<div className="flex gap-3">
				{onRetry && (
					<button onClick={onRetry} className="btn btn--primary btn--sm">
						<Icon name="refresh" size={14} /> {tCommon('retry')}
					</button>
				)}
				{showHomeLink && (
					<a href="/" className="btn btn--outline btn--sm">
						<Icon name="home" size={14} /> {tCommon('goHome')}
					</a>
				)}
			</div>
		</div>
	);
}
