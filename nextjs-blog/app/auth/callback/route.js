import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Callback para OAuth (Google, GitHub)
 * Supabase redirige aquí después del login con proveedores externos
 */
export async function GET(request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	const redirectTo = searchParams.get('redirectTo') || '/';

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return NextResponse.redirect(`${origin}${redirectTo}`);
		}
	}

	// Si hay error, redirigir a login con mensaje de error
	return NextResponse.redirect(`${origin}/login?error=auth_error`);
}

