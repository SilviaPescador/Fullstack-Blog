'use client';

import { useRef, useEffect, useMemo } from 'react';
import { generatePlant } from './PlantGenerator';

function svgElement(el, i) {
	const s = { transition: 'opacity 0.3s' };
	const cls = el.className || '';
	const o = el.opacity;

	switch (el.type) {
		case 'path':
			return <path key={i} opacity={o} className={cls} style={s} d={el.d} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill || 'none'} />;
		case 'line':
			return <line key={i} opacity={o} className={cls} style={s} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
		case 'polyline':
			return <polyline key={i} opacity={o} className={cls} style={s} points={el.points} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill || 'none'} />;
		case 'circle':
			return <circle key={i} opacity={o} className={cls} style={s} cx={el.cx} cy={el.cy} r={el.r} fill={el.fill} />;
		case 'ellipse':
			return <ellipse key={i} opacity={o} className={cls} style={s} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} fill={el.fill} transform={el.transform} />;
		case 'rect':
			return <rect key={i} opacity={o} className={cls} style={s} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} transform={el.transform} />;
		case 'polygon':
			return <polygon key={i} opacity={o} className={cls} style={s} points={el.points} fill={el.fill} transform={el.transform} />;
		default:
			return null;
	}
}

export default function Plant({ dna, x, y, postTitle, postAuthor, onClick, isNew = false, waterCount = 0 }) {
	const groupRef = useRef(null);
	const { elements, totalHeight } = useMemo(() => generatePlant(dna), [dna]);
	// Scale up to 1.4x at 20 waterings
	const growthScale = 1 + Math.min(waterCount, 20) * 0.02;
	const brightness = waterCount > 0 ? 1 + Math.min(waterCount, 20) * 0.015 : 1;

	useEffect(() => {
		if (!groupRef.current || typeof window === 'undefined') return;
		let gsapModule;
		(async () => {
			gsapModule = (await import('gsap')).default;
			const group = groupRef.current;
			if (!group) return;

			if (isNew) {
				gsapModule.fromTo(group, { scaleY: 0, scaleX: 0.5, opacity: 0, transformOrigin: 'bottom center' },
					{ scaleY: 1, scaleX: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
			} else {
				const stems = group.querySelectorAll('.plant-stem');
				stems.forEach((stem) => {
					const len = stem.getTotalLength?.();
					if (len) {
						gsapModule.fromTo(stem,
							{ strokeDasharray: len, strokeDashoffset: len },
							{ strokeDashoffset: 0, duration: 0.8 + Math.random() * 0.4, ease: 'power2.out' });
					}
				});

				const leaves = group.querySelectorAll('.plant-leaf, .plant-node, .plant-crown');
				gsapModule.fromTo(leaves,
					{ scale: 0, opacity: 0, transformOrigin: 'center' },
					{ scale: 1, opacity: (i, el) => el.getAttribute('opacity') || 1, duration: 0.4, stagger: 0.06, delay: 0.5, ease: 'back.out(2)' });
			}
		})();
	}, [isNew]);

	return (
		<g
			ref={groupRef}
			transform={`translate(${x}, ${y}) scale(${growthScale})`}
			style={{ cursor: 'inherit', filter: waterCount > 0 ? `brightness(${brightness})` : undefined, transformOrigin: `${x}px ${y}px` }}
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label={`Post: ${postTitle} por ${postAuthor}`}
			onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
		>
			<title>{`${postTitle} - ${postAuthor}`}</title>
			{elements.map((el, i) => svgElement(el, i))}
			{/* Invisible hit area for easier clicking */}
			<rect
				x={-20} y={-totalHeight - 10}
				width={40} height={totalHeight + 15}
				fill="transparent"
				stroke="none"
			/>
		</g>
	);
}
