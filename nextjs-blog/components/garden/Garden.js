'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Plant from './Plant';
import PlantTooltip from './PlantTooltip';
import { calculatePlantPositions, defaultVisualDna } from './gardenUtils';

const GARDEN_HEIGHT = 320;

export default function Garden({ posts: initialPosts = [], newPostIds: initialNewIds = [] }) {
	const router = useRouter();
	const containerRef = useRef(null);
	const [posts, setPosts] = useState(initialPosts);
	const [newPostIds, setNewPostIds] = useState(initialNewIds);
	const [dimensions, setDimensions] = useState({ width: 900, height: GARDEN_HEIGHT });
	const [tooltip, setTooltip] = useState({ visible: false, post: null, x: 0, y: 0 });

	// Keep posts in sync with props
	useEffect(() => {
		setPosts(initialPosts);
	}, [initialPosts]);

	// Supabase Realtime: listen for newly approved posts
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
					const exists = prev.some(p => p.id === updated.id);
					if (exists) return prev;
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
		const el = containerRef.current;
		if (!el) return;
		const obs = new ResizeObserver(([entry]) => {
			setDimensions({ width: entry.contentRect.width, height: GARDEN_HEIGHT });
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const plantsData = posts.map((post) => ({
		...post,
		dna: post.visual_dna || defaultVisualDna(post.id, post.title, post.content),
	}));

	const positions = calculatePlantPositions(
		plantsData.map(p => p.dna),
		dimensions.width,
		dimensions.height
	);

	const handlePlantEnter = useCallback((post, plantX, plantY) => {
		setTooltip({ visible: true, post, x: plantX, y: plantY });
	}, []);

	const handlePlantLeave = useCallback(() => {
		setTooltip(prev => ({ ...prev, visible: false }));
	}, []);

	return (
		<div ref={containerRef} className="relative" style={{ width: '100%', marginBottom: 'var(--space-lg)' }}>
			<svg
				width="100%"
				height={GARDEN_HEIGHT}
				viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
				preserveAspectRatio="xMidYMax meet"
				style={{ display: 'block', overflow: 'visible' }}
			>
				<defs>
					<radialGradient id="gardenGlow" cx="50%" cy="100%" r="60%">
						<stop offset="0%" stopColor="var(--color-accent-green)" stopOpacity="0.06" />
						<stop offset="100%" stopColor="transparent" stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* Subtle ground glow */}
				<rect x="0" y={dimensions.height * 0.5} width={dimensions.width} height={dimensions.height * 0.5} fill="url(#gardenGlow)" />

				{/* Ground line */}
				<line
					x1="0" y1={dimensions.height - 20}
					x2={dimensions.width} y2={dimensions.height - 20}
					stroke="var(--color-border)"
					strokeWidth="1"
					strokeDasharray="4 4"
					opacity="0.5"
				/>

				{/* Plants */}
				{plantsData.map((post, i) => {
					const pos = positions[i];
					if (!pos) return null;
					return (
						<g
							key={post.id}
							className="plant-group"
							onMouseEnter={() => handlePlantEnter(post, pos.x, pos.y - 10)}
							onMouseLeave={handlePlantLeave}
						>
							<Plant
								dna={post.dna}
								x={pos.x}
								y={pos.y}
								postTitle={post.title}
								postAuthor={post.author}
								onClick={() => router.push(`/posts/${post.id}`)}
								isNew={newPostIds.includes(post.id)}
							/>
						</g>
					);
				})}

				{/* Empty state */}
				{posts.length === 0 && (
					<text
						x={dimensions.width / 2}
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

			<PlantTooltip {...tooltip} containerWidth={dimensions.width} containerHeight={dimensions.height} />
		</div>
	);
}
