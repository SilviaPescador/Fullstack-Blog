import { moderatePost } from '@/lib/claude';

export async function runModeration(supabase, { postId, title, content }) {
	if (!process.env.ANTHROPIC_API_KEY) {
		const { defaultVisualDna } = await import('@/components/garden/gardenUtils');
		const dna = defaultVisualDna(postId, title, content);
		const plain = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
		const { error } = await supabase
			.from('posts')
			.update({
				status: 'reviewed_by_ai',
				ai_summary: plain.length > 150 ? plain.substring(0, 150) + '...' : plain,
				ai_tags: ['unclassified'],
				visual_dna: dna,
				reviewed_at: new Date().toISOString(),
			})
			.eq('id', postId);
		if (error) {
			console.error('Error saving fallback moderation:', error);
			return { ok: false, error };
		}
		return { ok: true, skipped: true };
	}

	const result = await moderatePost(title, content);
	const { error } = await supabase
		.from('posts')
		.update({
			status: 'reviewed_by_ai',
			ai_summary: result.summary,
			ai_tags: result.tags,
			visual_dna: result.visual_dna,
			reviewed_at: new Date().toISOString(),
		})
		.eq('id', postId);

	if (error) {
		console.error('Error saving AI moderation:', error);
		return { ok: false, error };
	}
	return { ok: true, result };
}
