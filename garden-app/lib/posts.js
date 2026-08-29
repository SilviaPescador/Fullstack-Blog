export function formatPost(post, wateredIds = new Set()) {
	return {
		id: post.id,
		title: post.title,
		content: post.content,
		image: post.image_url,
		author: post.profiles?.full_name || 'Anonimo',
		author_id: post.author_id,
		post_date: post.created_at,
		created_at: post.created_at,
		updated_at: post.updated_at,
		visual_dna: post.visual_dna,
		water_count: post.water_count || 0,
		watered_by_me: wateredIds.has(Number(post.id)),
	};
}

export async function getWateredPostIds(supabase) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return new Set();

	const { data } = await supabase
		.from('waterings')
		.select('post_id')
		.eq('user_id', user.id);

	return new Set((data || []).map((row) => Number(row.post_id)));
}
