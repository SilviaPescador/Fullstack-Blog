import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from './config';

export default getRequestConfig(async () => {
	// Obtener el idioma de la cookie o usar el predeterminado
	const cookieStore = await cookies();
	const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
	
	// Validar que el locale sea válido
	const locale = locales.includes(localeCookie) ? localeCookie : defaultLocale;

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	};
});
