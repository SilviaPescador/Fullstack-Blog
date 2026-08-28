'use client';

import { useMemo } from 'react';
import { generatePlant } from './PlantGenerator';
import { renderSvgElement } from './svgElements';

export default function PlantPreview({ dna, waterCount = 0, width = 80, maxHeight = 160 }) {
	const { elements, totalHeight } = useMemo(
		() => generatePlant(dna, waterCount),
		[dna, waterCount]
	);
	const svgH = totalHeight + 20;

	return (
		<svg
			width={width}
			height={Math.min(svgH, maxHeight)}
			viewBox={`-52 ${-svgH} 104 ${svgH + 8}`}
			style={{ display: 'block', margin: '0 auto' }}
		>
			{elements.map(renderSvgElement)}
		</svg>
	);
}
