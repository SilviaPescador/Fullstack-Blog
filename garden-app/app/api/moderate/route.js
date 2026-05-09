import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moderatePost } from '@/lib/claude';
import { isValidPostId } from '@/lib/validation';

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

		// Fetch the post
		const { data: post, error: fetchError } = await supabase
			.from('posts')
			.select('title, content, status')
			.eq('id', post_id)
			.single();

		if (fetchError || !post) {
			return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
		}

		if (post.status !== 'pending') {
			return NextResponse.json({ error: 'El post ya fue revisado' }, { status: 400 });
		}

		// Skip moderation if no API key configured (graceful degradation)
		if (!process.env.ANTHROPIC_API_KEY) {
			const { defaultVisualDna } = await import('@/components/garden/gardenUtils');
			const dna = defaultVisualDna(post_id, post.title, post.content);

			await supabase
				.from('posts')
				.update({
					status: 'reviewed_by_ai',
					ai_summary: post.content.substring(0, 150) + '...',
					ai_tags: ['unclassified'],
					visual_dna: dna,
					reviewed_at: new Date().toISOString(),
				})
				.eq('id', post_id);

			return NextResponse.json({ message: 'Moderacion omitida (sin API key)', status: 'reviewed_by_ai' });
		}

		// Call Claude for moderation
		const result = await moderatePost(post.title, post.content);

		// Update post with AI results
		const { error: updateError } = await supabase
			.from('posts')
			.update({
				status: 'reviewed_by_ai',
				ai_summary: result.summary,
				ai_tags: result.tags,
				visual_dna: result.visual_dna,
				reviewed_at: new Date().toISOString(),
			})
			.eq('id', post_id);

		if (updateError) {
			console.error('Error updating post with AI results:', updateError);
			return NextResponse.json({ error: 'Error al guardar resultados' }, { status: 500 });
		}

		return NextResponse.json({
			message: 'Post moderado correctamente',
			status: 'reviewed_by_ai',
			spam_score: result.spam_score,
			toxicity_score: result.toxicity_score,
		});
	} catch (error) {
		console.error('Moderation error:', error);
		return NextResponse.json({ error: 'Error en la moderacion' }, { status: 500 });
	}
}
