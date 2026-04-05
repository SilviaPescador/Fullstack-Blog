'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icons';

export default function ThemeToggle() {
	const [theme, setTheme] = useState('dark');

	useEffect(() => {
		const stored = localStorage.getItem('theme');
		const current = stored || document.documentElement.getAttribute('data-theme') || 'dark';
		setTheme(current);
	}, []);

	const toggle = () => {
		const next = theme === 'dark' ? 'light' : 'dark';
		setTheme(next);
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem('theme', next);
	};

	return (
		<button
			onClick={toggle}
			className="btn btn--ghost btn--icon"
			aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
		>
			<Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
		</button>
	);
}
