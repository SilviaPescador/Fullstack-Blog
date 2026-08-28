import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidPostId } from '@/lib/validation';
import { runModeration } from '@/lib/moderation';

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

		const { post_id } = await request.json();
		if (!post_id || !isValidPostId(post_id)) {
			return NextResponse.json({ error: 'post_id invalido' }, { status: 400 });
		}

		const { data: post, error: fetchError } = await supabase
			.from('posts')
			.select('title, content, status, author_id')
			.eq('id', post_id)
			.single();

		if (fetchError || !post) {
			return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		const isAuthor = post.author_id === user.id;
		const isAdmin = profile?.role === 'admin';
		if (!isAuthor && !isAdmin) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
		}

		if (post.status !== 'pending') {
			return NextResponse.json({ error: 'El post ya fue revisado' }, { status: 400 });
		}

		const outcome = await runModeration(supabase, {
			postId: post_id,
			title: post.title,
			content: post.content,
		});

		if (!outcome.ok) {
			return NextResponse.json({ error: 'Error al guardar resultados' }, { status: 500 });
		}

		if (outcome.skipped) {
			return NextResponse.json({ message: 'Moderacion omitida (sin API key)', status: 'reviewed_by_ai' });
		}

		return NextResponse.json({
			message: 'Post moderado correctamente',
			status: 'reviewed_by_ai',
			spam_score: outcome.result.spam_score,
			toxicity_score: outcome.result.toxicity_score,
		});
	} catch (error) {
		console.error('Moderation error:', error);
		return NextResponse.json({ error: 'Error en la moderacion' }, { status: 500 });
	}
}
