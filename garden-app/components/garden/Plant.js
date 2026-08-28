'use client';

import { useRef, useEffect, useMemo } from 'react';
import { generatePlant } from './PlantGenerator';
import { renderSvgElement } from './svgElements';

export default function Plant({ dna, x, y, postTitle, postAuthor, onClick, isNew = false, waterCount = 0 }) {
	const groupRef = useRef(null);
	const { elements, totalHeight } = useMemo(() => generatePlant(dna, waterCount), [dna, waterCount]);
	const brightness = waterCount > 0 ? 1 + Math.min(waterCount, 10) * 0.025 : 1;

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

				const leaves = group.querySelectorAll('.plant-leaf, .plant-node, .plant-crown, .plant-petal, .plant-dew, .plant-sparkle');
				gsapModule.fromTo(leaves,
					{ scale: 0, opacity: 0, transformOrigin: 'center' },
					{ scale: 1, opacity: (i, el) => el.getAttribute('opacity') || 1, duration: 0.4, stagger: 0.06, delay: 0.5, ease: 'back.out(2)' });
			}
		})();
	}, [isNew]);

	return (
		<g
			ref={groupRef}
			transform={`translate(${x}, ${y})`}
			style={{ cursor: 'inherit', filter: waterCount > 0 ? `brightness(${brightness})` : undefined }}
			onClick={onClick}
			role="button"
			tabIndex={0}
			aria-label={`Post: ${postTitle} por ${postAuthor}`}
			onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
		>
			<title>{`${postTitle} - ${postAuthor}`}</title>
			{elements.map((el, i) => renderSvgElement(el, i))}
			<rect
				x={-40} y={-totalHeight - 12}
				width={80} height={totalHeight + 18}
				fill="transparent"
				stroke="none"
			/>
		</g>
	);
}
