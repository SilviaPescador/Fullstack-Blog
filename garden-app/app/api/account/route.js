import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

		const { error } = await supabase.rpc('delete_own_account');
		if (error) {
			console.error('delete_own_account', error);
			return NextResponse.json(
				{ error: 'No se pudo eliminar la cuenta' },
				{ status: 500 }
			);
		}

		await supabase.auth.signOut();
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error deleting account:', error);
		return NextResponse.json(
			{ error: 'No se pudo eliminar la cuenta' },
			{ status: 500 }
		);
	}
}
