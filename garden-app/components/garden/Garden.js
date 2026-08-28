'use client';

import { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Plant from './Plant';
import PlantTooltip from './PlantTooltip';
import { calculateGardenLayout, defaultVisualDna } from './gardenUtils';
import Icon from '@/components/Icons';

const GARDEN_HEIGHT = 340;
const PAN_RATIO = 0.7;

export default function Garden({ posts: initialPosts = [], newPostIds: initialNewIds = [] }) {
	const router = useRouter();
	const frameRef = useRef(null);
	const viewportRef = useRef(null);
	const stickToNewest = useRef(true);
	const didInitScroll = useRef(false);

	const [posts, setPosts] = useState(initialPosts);
	const [newPostIds, setNewPostIds] = useState(initialNewIds);
	const [dimensions, setDimensions] = useState({ width: 900, height: GARDEN_HEIGHT });
	const [tooltip, setTooltip] = useState({ visible: false, post: null, x: 0, y: 0 });
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(false);

	useEffect(() => {
		setPosts(initialPosts);
	}, [initialPosts]);

	useEffect(() => {
		const supabase = createClient();
		const channel = supabase
			.channel('garden-realtime')
			.on('postgres_changes', {
				event: 'UPDATE',
				schema: 'public',
				table: 'posts',
				filter: 'status=eq.approved',
			}, (payload) => {
				const updated = payload.new;
				setPosts(prev => {
					const exists = prev.find(p => p.id === updated.id);
					if (exists) {
						return prev.map(p => p.id === updated.id
							? { ...p, water_count: updated.water_count ?? p.water_count }
							: p
						);
					}
					const newPost = {
						id: updated.id,
						title: updated.title,
						content: updated.content,
						image: updated.image_url,
						author: 'Nuevo',
						author_id: updated.author_id,
						post_date: updated.created_at,
						created_at: updated.created_at,
						visual_dna: updated.visual_dna,
						water_count: updated.water_count || 0,
					};
					setNewPostIds(ids => [...ids, updated.id]);
					return [...prev, newPost];
				});
			})
			.subscribe();

		return () => { supabase.removeChannel(channel); };
	}, []);

	useEffect(() => {
		const el = frameRef.current;
		if (!el) return;
		const obs = new ResizeObserver(([entry]) => {
			setDimensions({ width: entry.contentRect.width, height: GARDEN_HEIGHT });
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const plantsData = useMemo(() => {
		return [...posts]
			.sort((a, b) => new Date(a.created_at || a.post_date) - new Date(b.created_at || b.post_date))
			.map((post) => ({
				...post,
				dna: post.visual_dna || defaultVisualDna(post.id, post.title, post.content),
			}));
	}, [posts]);

	const layout = useMemo(() => calculateGardenLayout(
		plantsData.map(p => p.dna),
		dimensions.width,
		dimensions.height
	), [plantsData, dimensions]);

	const planted = useMemo(() => {
		return plantsData
			.map((post, i) => ({ post, pos: layout.positions[i] }))
			.filter(item => item.pos)
			.sort((a, b) => a.pos.plane - b.pos.plane || a.pos.x - b.pos.x);
	}, [plantsData, layout.positions]);

	const updatePanState = useCallback(() => {
		const el = viewportRef.current;
		if (!el) return;
		const max = el.scrollWidth - el.clientWidth;
		const left = el.scrollLeft;
		setCanLeft(left > 8);
		setCanRight(left < max - 8);
		stickToNewest.current = left >= max - 48;
	}, []);

	useLayoutEffect(() => {
		const el = viewportRef.current;
		if (!el || !layout.needsPan) {
			didInitScroll.current = !layout.needsPan;
			setCanLeft(false);
			setCanRight(false);
			return;
		}

		const max = Math.max(0, el.scrollWidth - el.clientWidth);
		if (!didInitScroll.current) {
			el.scrollLeft = max;
			didInitScroll.current = true;
		} else if (stickToNewest.current) {
			el.scrollTo({ left: max, behavior: 'smooth' });
		}
		requestAnimationFrame(updatePanState);
	}, [layout.worldWidth, layout.needsPan, plantsData.length, updatePanState]);

	const pan = useCallback((dir) => {
		const el = viewportRef.current;
		if (!el) return;
		stickToNewest.current = false;
		el.scrollBy({ left: dir * el.clientWidth * PAN_RATIO, behavior: 'smooth' });
	}, []);

	const handleScroll = useCallback(() => {
		updatePanState();
		setTooltip(prev => (prev.visible ? { ...prev, visible: false } : prev));
	}, [updatePanState]);

	const handleKeyDown = useCallback((e) => {
		if (!layout.needsPan) return;
		if (e.key === 'ArrowLeft') { e.preventDefault(); pan(-1); }
		if (e.key === 'ArrowRight') { e.preventDefault(); pan(1); }
	}, [layout.needsPan, pan]);

	const handlePlantEnter = useCallback((post, plantX, plantY) => {
		const scroll = viewportRef.current?.scrollLeft || 0;
		setTooltip({ visible: true, post, x: plantX - scroll, y: plantY });
	}, []);

	const handlePlantLeave = useCallback(() => {
		setTooltip(prev => ({ ...prev, visible: false }));
	}, []);

	return (
		<div ref={frameRef} className="garden-frame">
			{layout.needsPan && (
				<>
					<button
						type="button"
						className="garden-pan garden-pan--left"
						aria-label="Ver plantas anteriores"
						disabled={!canLeft}
						onClick={() => pan(-1)}
					>
						<Icon name="chevronLeft" size={22} />
					</button>
					<button
						type="button"
						className="garden-pan garden-pan--right"
						aria-label="Ver plantas mas recientes"
						disabled={!canRight}
						onClick={() => pan(1)}
					>
						<Icon name="chevronRight" size={22} />
					</button>
					<div className={`garden-fade garden-fade--left ${canLeft ? 'is-visible' : ''}`} />
					<div className={`garden-fade garden-fade--right ${canRight ? 'is-visible' : ''}`} />
				</>
			)}

			<div
				ref={viewportRef}
				className="garden-viewport"
				tabIndex={layout.needsPan ? 0 : -1}
				onScroll={handleScroll}
				onKeyDown={handleKeyDown}
				aria-label="Jardin"
			>
				<svg
					width={layout.worldWidth}
					height={GARDEN_HEIGHT}
					viewBox={`0 0 ${layout.worldWidth} ${dimensions.height}`}
					preserveAspectRatio="xMidYMax meet"
				>
					{planted.map(({ post, pos }) => (
						<g
							key={post.id}
							className="plant-group"
							opacity={pos.opacity}
							transform={`translate(${pos.x}, ${pos.y}) scale(${pos.scale})`}
							onMouseEnter={() => handlePlantEnter(post, pos.x, pos.y - 10)}
							onMouseLeave={handlePlantLeave}
						>
							<Plant
								dna={post.dna}
								x={0}
								y={0}
								postTitle={post.title}
								postAuthor={post.author}
								onClick={() => router.push(`/posts/${post.id}`)}
								isNew={newPostIds.includes(post.id)}
								waterCount={post.water_count || 0}
							/>
						</g>
					))}

					{posts.length === 0 && (
						<text
							x={layout.worldWidth / 2}
							y={dimensions.height / 2}
							textAnchor="middle"
							fill="var(--color-text-muted)"
							fontSize="14"
							fontFamily="var(--font-body)"
						>
							El jardin espera sus primeras semillas...
						</text>
					)}
				</svg>
			</div>

			<PlantTooltip {...tooltip} containerWidth={dimensions.width} containerHeight={dimensions.height} />
		</div>
	);
}
