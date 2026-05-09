'use client';

export default function PlantTooltip({ post, x, y, visible, containerWidth, containerHeight }) {
	if (!visible || !post) return null;

	const leftPct = containerWidth ? (x / containerWidth) * 100 : 50;
	const topPct = containerHeight ? (y / containerHeight) * 100 : 50;

	return (
		<div
			style={{
				position: 'absolute',
				left: `${leftPct}%`,
				top: `${topPct}%`,
				transform: 'translate(-50%, -100%) translateY(-16px)',
				background: 'var(--color-bg-elevated)',
				border: '1px solid var(--color-accent-green-soft)',
				borderRadius: 'var(--radius-md)',
				padding: 'var(--space-sm) var(--space-md)',
				maxWidth: '220px',
				pointerEvents: 'none',
				zIndex: 50,
				boxShadow: '0 0 12px var(--color-accent-green-soft), var(--shadow-lg)',
				opacity: visible ? 1 : 0,
				transition: 'opacity 0.15s ease',
			}}
		>
			<p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
				{post.title}
			</p>
			<p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
				{post.author}
			</p>
		</div>
	);
}
