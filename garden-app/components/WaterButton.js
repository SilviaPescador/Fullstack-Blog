'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icons';
import { createClient } from '@/lib/supabase/client';

export default function WaterButton({ postId, initialCount = 0, onWater }) {
	const [count, setCount] = useState(initialCount);
	const [watered, setWatered] = useState(false);
	const [loading, setLoading] = useState(true);
	const [animating, setAnimating] = useState(false);
	const [authError, setAuthError] = useState(false);

	useEffect(() => {
		const checkWatered = async () => {
			try {
				const supabase = createClient();

				// Fetch fresh total count from DB (initialCount may be stale)
				const { data: postData } = await supabase
					.from('posts')
					.select('water_count')
					.eq('id', postId)
					.single();

				if (postData?.water_count != null) {
					setCount(postData.water_count);
				}

				// Check if current user has already watered
				const { data: { user } } = await supabase.auth.getUser();
				if (!user) { setLoading(false); return; }

				const { data: watering } = await supabase
					.from('waterings')
					.select('id')
					.eq('post_id', postId)
					.eq('user_id', user.id)
					.maybeSingle();

				if (watering) setWatered(true);
			} catch {
				// silently fail
			} finally {
				setLoading(false);
			}
		};
		checkWatered();
	}, [postId]);

	const handleWater = async () => {
		if (watered || loading) return;

		const supabase = createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			setAuthError(true);
			return;
		}

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
				onWater?.(postId, data.water_count);
			} else if (res.status === 409) {
				setWatered(true);
			} else if (res.status === 401) {
				setAuthError(true);
			}
		} catch (e) {
			console.error('Water error:', e);
		}
		setTimeout(() => setAnimating(false), 600);
	};

	return (
		<>
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
			{authError && (
				<span className="text-error text-xs" style={{ marginLeft: 'var(--space-xs)' }}>
					Inicia sesion para regar
				</span>
			)}
		</>
	);
}
