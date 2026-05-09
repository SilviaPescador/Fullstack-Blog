'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { locales, localeNames } from '@/i18n/config';
import Icon from '@/components/Icons';

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
				className="btn btn--ghost btn--sm flex items-center gap-2"
				aria-expanded={open}
				disabled={isPending}
				onClick={() => setOpen((v) => !v)}
			>
				<Icon name="globe" size={16} />
				<span className="hidden sm:inline">{localeNames[locale]}</span>
			</button>
			{open && (
				<ul className="dropdown__menu">
					{locales.map((loc) => (
						<li key={loc}>
							<button
								className={`dropdown__item ${loc === locale ? 'dropdown__item--active' : ''}`}
								onClick={() => handleChange(loc)}
								disabled={loc === locale || isPending}
							>
								{localeNames[loc]}
								{loc === locale && <Icon name="check" size={14} />}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
