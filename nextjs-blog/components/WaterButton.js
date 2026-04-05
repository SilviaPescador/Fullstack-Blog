'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icons';
import { createClient } from '@/lib/supabase/client';

export default function WaterButton({ postId, initialCount = 0 }) {
	const [count, setCount] = useState(initialCount);
	const [watered, setWatered] = useState(false);
	const [loading, setLoading] = useState(true);
	const [animating, setAnimating] = useState(false);

	useEffect(() => {
		const checkWatered = async () => {
			try {
				const supabase = createClient();
				const { data: { user } } = await supabase.auth.getUser();
				if (!user) { setLoading(false); return; }

				const { data } = await supabase
					.from('waterings')
					.select('id')
					.eq('post_id', postId)
					.eq('user_id', user.id)
					.maybeSingle();

				if (data) setWatered(true);
			} catch {
				// silently fail - user can still try to water
			} finally {
				setLoading(false);
			}
		};
		checkWatered();
	}, [postId]);

	const handleWater = async () => {
		if (watered || loading) return;

		setAnimating(true);
		try {
			const res = await fetch('/api/water', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ post_id: postId }),
			});

			if (res.ok) {
				const data = await res.json();
				setCount(data.water_count);
				setWatered(true);
			} else if (res.status === 409) {
				setWatered(true);
			}
		} catch (e) {
			console.error('Water error:', e);
		}
		setTimeout(() => setAnimating(false), 600);
	};

	return (
		<button
			className={`btn btn--ghost btn--sm flex items-center gap-2 ${watered ? 'text-accent' : ''}`}
			onClick={handleWater}
			disabled={watered || loading}
			title={watered ? 'Ya regaste este post' : 'Regar este post'}
			style={animating ? { transform: 'scale(1.2)', transition: 'transform 0.3s ease' } : { transition: 'transform 0.3s ease' }}
		>
			<Icon name="droplet" size={16} />
			<span>{count}</span>
		</button>
	);
}
