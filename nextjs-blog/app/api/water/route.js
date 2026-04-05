import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
			return NextResponse.json({ error: 'Debes iniciar sesion para regar' }, { status: 401 });
		}

		const { post_id } = await request.json();
		if (!post_id || !isValidPostId(post_id)) {
			return NextResponse.json({ error: 'post_id invalido' }, { status: 400 });
		}

		// Insert watering (UNIQUE constraint prevents duplicates)
		const { error: insertError } = await supabase
			.from('waterings')
			.insert({ post_id, user_id: user.id });

		if (insertError) {
			if (insertError.code === '23505') {
				return NextResponse.json({ error: 'Ya has regado este post' }, { status: 409 });
			}
			console.error('Watering error:', insertError);
			return NextResponse.json({ error: 'Error al regar' }, { status: 500 });
		}

		// The trigger in DB automatically increments water_count
		// Fetch updated count
		const { data: post } = await supabase
			.from('posts')
			.select('water_count')
			.eq('id', post_id)
			.single();

		return NextResponse.json({ water_count: post?.water_count || 1 });
	} catch (error) {
		console.error('Water error:', error);
		return NextResponse.json({ error: 'Error al regar' }, { status: 500 });
	}
}
