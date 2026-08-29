import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { expireAuthCookies } from '@/lib/supabase/authCookies';
import { AccountDeleteError, deleteUserAccount } from '@/lib/deleteAccount';

export async function DELETE() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		await deleteUserAccount(user.id);

		const response = NextResponse.json({ ok: true });
		const cookieStore = await cookies();
		return expireAuthCookies(response, cookieStore.getAll());
	} catch (error) {
		if (error instanceof AccountDeleteError) {
			return NextResponse.json({ error: error.code }, { status: error.status });
		}
		console.error('Error deleting account:', error);
		return NextResponse.json(
			{ error: 'No se pudo eliminar la cuenta' },
			{ status: 500 }
		);
	}
}
