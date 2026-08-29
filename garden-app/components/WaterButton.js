'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToastProvider';

export default function WaterButton({ postId, count = 0, watered = false, onWater }) {
	const pendingRef = useRef(false);
	const sparkleTimer = useRef(null);
	const [sparkle, setSparkle] = useState(false);
	const { isLoggedIn, loading: authLoading } = useAuth();
	const { showToast } = useToast();
	const t = useTranslations('posts.water');

	useEffect(() => () => {
		if (sparkleTimer.current) clearTimeout(sparkleTimer.current);
	}, []);

	const handleWater = async () => {
		if (pendingRef.current || authLoading) return;

		if (!isLoggedIn) {
			showToast('info', t('loginRequired'));
			return;
		}

		pendingRef.current = true;
		const adding = !watered;
		const previousCount = count;
		if (adding) setSparkle(true);

		onWater?.(postId, adding ? count + 1 : Math.max(0, count - 1), adding);

		try {
			const res = await fetch('/api/water', {
				method: adding ? 'POST' : 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ post_id: postId }),
			});

			if (res.ok) {
				const data = await res.json();
				onWater?.(postId, data.water_count, data.watered);
			} else if (res.status === 401) {
				onWater?.(postId, previousCount, watered);
				showToast('info', t('loginRequired'));
			} else if (res.status === 409 && adding) {
				onWater?.(postId, previousCount, true);
			} else if (res.status === 404 && !adding) {
				onWater?.(postId, previousCount, false);
			} else {
				onWater?.(postId, previousCount, watered);
			}
		} catch (e) {
			console.error('Water error:', e);
			onWater?.(postId, previousCount, watered);
		} finally {
			pendingRef.current = false;
			if (adding) {
				if (sparkleTimer.current) clearTimeout(sparkleTimer.current);
				sparkleTimer.current = setTimeout(() => setSparkle(false), 550);
			}
		}
	};

	return (
		<button
			type="button"
			className={`water-btn btn btn--ghost btn--sm flex items-center gap-2${watered ? ' is-watered' : ''}${sparkle ? ' is-sparkle' : ''}`}
			onClick={handleWater}
			aria-pressed={watered}
			aria-label={watered ? t('unwater') : t('label')}
		>
			<span className="water-btn__icon">
				<Icon name="droplet" size={16} />
			</span>
			<span>{count}</span>
		</button>
	);
}
