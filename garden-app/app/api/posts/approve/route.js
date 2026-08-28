import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApprovalEmail } from '@/lib/email';
import { isValidPostId } from '@/lib/validation';
import { defaultVisualDna } from '@/components/garden/gardenUtils';

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
			const { data: post } = await supabase
				.from('posts')
				.select('id, title, content, author_id, visual_dna')
				.eq('id', post_id)
				.single();

			const approved = {
				status: 'approved',
				approved_at: new Date().toISOString(),
			};
			if (post && !post.visual_dna) {
				approved.visual_dna = defaultVisualDna(post.id, post.title, post.content);
			}

			await supabase.from('posts').update(approved).eq('id', post_id);

			if (post?.author_id) {
				const { data: authorEmail } = await supabase.rpc('admin_profile_email', {
					target_id: post.author_id,
				});
				if (authorEmail) {
					await sendApprovalEmail(authorEmail, post.title, post_id);
				}
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
