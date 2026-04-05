'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { locales, localeNames } from '@/i18n/config';

export default function LocaleSwitcher() {
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleChange = (newLocale) => {
		setOpen(false);
		startTransition(() => {
			document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
			window.location.reload();
		});
	};

	return (
		<div className="dropdown" ref={ref}>
			<button
				className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
				type="button"
				aria-expanded={open}
				disabled={isPending}
				onClick={() => setOpen((v) => !v)}
			>
				<i className="bi bi-globe2"></i>
				<span className="d-none d-sm-inline">{localeNames[locale]}</span>
			</button>
			<ul className={`dropdown-menu dropdown-menu-end${open ? ' show' : ''}`}>
				{locales.map((loc) => (
					<li key={loc}>
						<button
							className={`dropdown-item ${loc === locale ? 'active' : ''}`}
							onClick={() => handleChange(loc)}
							disabled={loc === locale || isPending}
						>
							{localeNames[loc]}
							{loc === locale && <i className="bi bi-check ms-2"></i>}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
