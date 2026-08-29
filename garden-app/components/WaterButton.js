'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToastProvider';

export default function WaterButton({ postId, count: countProp = 0, watered: wateredProp = false, onWater }) {
	const pendingRef = useRef(false);
	const sparkleTimer = useRef(null);
	const [count, setCount] = useState(countProp);
	const [watered, setWatered] = useState(wateredProp);
	const [sparkle, setSparkle] = useState(false);
	const { isLoggedIn, loading: authLoading } = useAuth();
	const { showToast } = useToast();
	const t = useTranslations('posts.water');

	useEffect(() => {
		if (pendingRef.current) return;
		setCount(countProp);
		setWatered(wateredProp);
	}, [countProp, wateredProp]);

	useEffect(() => () => {
		if (sparkleTimer.current) clearTimeout(sparkleTimer.current);
	}, []);

	const apply = (nextCount, nextWatered) => {
		setCount(nextCount);
		setWatered(nextWatered);
		onWater?.(postId, nextCount, nextWatered);
	};

	const handleWater = async () => {
		if (pendingRef.current || authLoading) return;

		if (!isLoggedIn) {
			showToast('info', t('loginRequired'));
			return;
		}

		pendingRef.current = true;
		const adding = !watered;
		const previousCount = count;
		const previousWatered = watered;
		if (adding) setSparkle(true);

		apply(adding ? count + 1 : Math.max(0, count - 1), adding);

		try {
			const res = await fetch('/api/water', {
				method: adding ? 'POST' : 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ post_id: postId }),
			});

			if (res.ok) {
				const data = await res.json();
				apply(data.water_count, data.watered);
			} else if (res.status === 401) {
				apply(previousCount, previousWatered);
				showToast('info', t('loginRequired'));
			} else if (res.status === 409 && adding) {
				apply(previousCount, true);
			} else if (res.status === 404 && !adding) {
				apply(previousCount, false);
			} else {
				apply(previousCount, previousWatered);
			}
		} catch (e) {
			console.error('Water error:', e);
			apply(previousCount, previousWatered);
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
