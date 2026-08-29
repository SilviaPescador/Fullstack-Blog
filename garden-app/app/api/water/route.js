import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidPostId } from '@/lib/validation';

async function getUserAndPostId(request) {
	const contentType = request.headers.get('content-type');
	if (!contentType?.includes('application/json')) {
		return { error: NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 }) };
	}

	const supabase = await createClient();
	const { data: { user }, error: authError } = await supabase.auth.getUser();
	if (authError || !user) {
		return { error: NextResponse.json({ error: 'Debes iniciar sesion para regar' }, { status: 401 }) };
	}

	const { post_id } = await request.json();
	if (!post_id || !isValidPostId(post_id)) {
		return { error: NextResponse.json({ error: 'post_id invalido' }, { status: 400 }) };
	}

	return { supabase, user, post_id };
}

async function waterCount(supabase, postId) {
	const { data: post } = await supabase
		.from('posts')
		.select('water_count')
		.eq('id', postId)
		.single();
	return post?.water_count ?? 0;
}

export async function POST(request) {
	try {
		const parsed = await getUserAndPostId(request);
		if (parsed.error) return parsed.error;
		const { supabase, user, post_id } = parsed;

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

		return NextResponse.json({ water_count: await waterCount(supabase, post_id), watered: true });
	} catch (error) {
		console.error('Water error:', error);
		return NextResponse.json({ error: 'Error al regar' }, { status: 500 });
	}
}

export async function DELETE(request) {
	try {
		const parsed = await getUserAndPostId(request);
		if (parsed.error) return parsed.error;
		const { supabase, user, post_id } = parsed;

		const { data, error: deleteError } = await supabase
			.from('waterings')
			.delete()
			.eq('post_id', post_id)
			.eq('user_id', user.id)
			.select('id');

		if (deleteError) {
			console.error('Unwater error:', deleteError);
			return NextResponse.json({ error: 'Error al quitar el riego' }, { status: 500 });
		}

		if (!data?.length) {
			return NextResponse.json({ error: 'No habias regado este post' }, { status: 404 });
		}

		return NextResponse.json({ water_count: await waterCount(supabase, post_id), watered: false });
	} catch (error) {
		console.error('Unwater error:', error);
		return NextResponse.json({ error: 'Error al quitar el riego' }, { status: 500 });
	}
}
