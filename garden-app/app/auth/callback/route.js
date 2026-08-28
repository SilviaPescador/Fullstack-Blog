import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeRedirectPath } from '@/lib/validation';

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	const redirectTo = safeRedirectPath(searchParams.get('redirectTo') || '/');

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return NextResponse.redirect(new URL(redirectTo, origin));
		}
	}

	return NextResponse.redirect(new URL('/login?error=auth_error', origin));
}
