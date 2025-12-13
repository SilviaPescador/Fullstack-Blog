'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { locales, localeNames } from '@/i18n/config';

export default function LocaleSwitcher() {
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();

	const handleChange = (newLocale) => {
		startTransition(() => {
			// Guardar el idioma en una cookie
			document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
			// Recargar la página para aplicar el cambio
			window.location.reload();
		});
	};

	return (
		<div className="dropdown">
			<button
				className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
				disabled={isPending}
			>
				<i className="bi bi-globe2"></i>
				<span className="d-none d-sm-inline">{localeNames[locale]}</span>
			</button>
			<ul className="dropdown-menu dropdown-menu-end">
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
