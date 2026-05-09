'use client';

export default function Footer() {
	return (
		<footer style={{
			padding: 'var(--space-lg) var(--space-md)',
			textAlign: 'center',
			color: 'var(--color-text-muted)',
			fontSize: 'var(--text-sm)',
			borderTop: '1px solid var(--color-border)',
		}}>
			The Garden | {new Date().getFullYear()}
		</footer>
	);
}
