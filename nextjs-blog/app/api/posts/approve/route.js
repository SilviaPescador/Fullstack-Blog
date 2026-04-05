import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApprovalEmail } from '@/lib/email';
import { isValidPostId } from '@/lib/validation';

const VALID_ACTIONS = ['approve', 'reject'];
const MAX_REASON_LENGTH = 500;

export async function POST(request) {
	try {
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
		}

		const supabase = await createClient();

		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
		if (profile?.role !== 'admin') {
			return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
		}

		const { post_id, action, reason } = await request.json();
		if (!post_id || !isValidPostId(post_id)) {
			return NextResponse.json({ error: 'post_id invalido' }, { status: 400 });
		}
		if (!action || !VALID_ACTIONS.includes(action)) {
			return NextResponse.json({ error: 'action invalida' }, { status: 400 });
		}

		if (action === 'approve') {
			// Approve the post
			await supabase.from('posts').update({
				status: 'approved',
				approved_at: new Date().toISOString(),
			}).eq('id', post_id);

			// Send email notification to author
			const { data: post } = await supabase
				.from('posts')
				.select('title, author_id, profiles:author_id(email)')
				.eq('id', post_id)
				.single();

			if (post?.profiles?.email) {
				await sendApprovalEmail(post.profiles.email, post.title, post_id);
			}

			return NextResponse.json({ message: 'Post aprobado' });
		}

	if (action === 'reject') {
		const safeReason = typeof reason === 'string' ? reason.trim().substring(0, MAX_REASON_LENGTH) : null;
		await supabase.from('posts').update({
			status: 'rejected',
			rejection_reason: safeReason || null,
		}).eq('id', post_id);

			return NextResponse.json({ message: 'Post rechazado' });
		}

		return NextResponse.json({ error: 'Accion no valida' }, { status: 400 });
	} catch (error) {
		console.error('Approve/reject error:', error);
		return NextResponse.json({ error: 'Error en la operacion' }, { status: 500 });
	}
}
