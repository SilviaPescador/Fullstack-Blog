import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/validation';
import { AccountDeleteError, deleteUserAccount } from '@/lib/deleteAccount';

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		if (!isValidUUID(id)) {
			return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
		}

		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (profile?.role !== 'admin') {
			return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
		}

		if (id === user.id) {
			return NextResponse.json({ error: 'SELF' }, { status: 400 });
		}

		await deleteUserAccount(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		if (error instanceof AccountDeleteError) {
			return NextResponse.json({ error: error.code }, { status: error.status });
		}
		console.error('Error deleting user:', error);
		return NextResponse.json(
			{ error: 'No se pudo eliminar la cuenta' },
			{ status: 500 }
		);
	}
}
