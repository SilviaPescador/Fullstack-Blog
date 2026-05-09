import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

/**
 * Cliente de Supabase para el middleware
 * Refresca la sesión del usuario en cada request
 */
export async function updateSession(request) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value)
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// IMPORTANTE: No escribir lógica entre createServerClient y supabase.auth.getUser()
	// Un simple error podría hacer que el usuario se desloguee aleatoriamente.

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Rutas protegidas - redirigir a login si no está autenticado
	const protectedRoutes = ['/posts/create-new'];
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	if (isProtectedRoute && !user) {
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		url.searchParams.set('redirectTo', request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	// Si el usuario está baneado, redirigir a página de baneo
	if (user) {
		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (profile?.role === 'banned' && request.nextUrl.pathname !== '/banned') {
			const url = request.nextUrl.clone();
			url.pathname = '/banned';
			return NextResponse.redirect(url);
		}
	}

	return supabaseResponse;
}

