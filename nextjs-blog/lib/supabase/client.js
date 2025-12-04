import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de Supabase para el navegador (Client Components)
 * Usa las keys públicas (NEXT_PUBLIC_*)
 */
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);
}

