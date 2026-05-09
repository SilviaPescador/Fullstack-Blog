import { createRng, rngRange, rngInt } from './gardenUtils';

// growthPhase: 0.0 (semilla) -> 1.0 (planta madura)
// 0 riegos = 0.15, 10+ riegos = 1.0
function getGrowthPhase(waterCount) {
	if (waterCount <= 0) return 0.15;
	if (waterCount >= 10) return 1.0;
	return 0.15 + (waterCount / 10) * 0.85;
}

// Generate SVG elements for a plant based on its visual DNA and water count
export function generatePlant(dna, waterCount = 0) {
	const rng = createRng(dna.seed || 0);
	const phase = getGrowthPhase(waterCount);
	// Base height scales with phase: 20px brote -> full height madura
	const maxH = 30 + dna.height * 18;
	const h = Math.round(maxH * Math.max(0.2, phase));
	const elements = [];

	switch (dna.type) {
		case 'geometric':
			generateGeometric(elements, dna, rng, h, phase);
			break;
		case 'organic':
			generateOrganic(elements, dna, rng, h, phase);
			break;
		case 'flowering':
			generateFlowering(elements, dna, rng, h, phase);
			break;
		case 'crystalline':
			generateCrystalline(elements, dna, rng, h, phase);
			break;
		default:
			generateOrganic(elements, dna, rng, h, phase);
	}

	return { elements, totalHeight: h };
}

function generateGeometric(els, dna, rng, h, phase) {
	// Segments grow with phase: min 1, max complexity+2
	const maxSegments = 2 + dna.complexity;
	const segments = Math.max(1, Math.round(maxSegments * phase));
	let y = 0;
	let x = 0;
	const segH = h / segments;
	const points = [[0, 0]];

	for (let i = 1; i <= segments; i++) {
		x += rngRange(rng, -4, 4);
		y -= segH;
		points.push([x, y]);
	}

	els.push({
		type: 'polyline',
		points: points.map(p => p.join(',')).join(' '),
		stroke: dna.primaryColor,
		strokeWidth: 2,
		fill: 'none',
		className: 'plant-stem',
	});

	// Nodes at joints - all visible once stem is drawn
	for (let i = 1; i < points.length; i++) {
		const [px, py] = points[i];
		const size = rngRange(rng, 2, 4);

		els.push({
			type: 'rect',
			x: px - size / 2,
			y: py - size / 2,
			width: size,
			height: size,
			fill: dna.secondaryColor,
			transform: `rotate(${rngRange(rng, 0, 45)} ${px} ${py})`,
			className: 'plant-node',
		});

		// Branches appear from phase 0.3+
		if (i < points.length - 1 && phase >= 0.3 && rng() > 0.3) {
			const dir = rng() > 0.5 ? 1 : -1;
			const bLen = rngRange(rng, 8, 16 + dna.branching * 3) * phase;
			els.push({
				type: 'line',
				x1: px, y1: py,
				x2: px + dir * bLen, y2: py - rngRange(rng, 0, 6),
				stroke: dna.primaryColor,
				strokeWidth: 1.5,
				opacity: 0.7,
				className: 'plant-branch',
			});
			els.push({
				type: 'circle',
				cx: px + dir * bLen,
				cy: py - rngRange(rng, 0, 6),
				r: rngRange(rng, 1.5, 3),
				fill: dna.secondaryColor,
				className: 'plant-leaf',
			});
		}
	}

	// Crown: diamond - appears from phase 0.5+
	if (phase >= 0.5) {
		const [tx, ty] = points[points.length - 1];
		const ds = (4 + dna.complexity) * Math.min(1, (phase - 0.5) * 2);
		els.push({
			type: 'polygon',
			points: `${tx},${ty - ds} ${tx + ds},${ty} ${tx},${ty + ds * 0.3} ${tx - ds},${ty}`,
			fill: dna.secondaryColor,
			opacity: 0.6 + phase * 0.3,
			className: 'plant-crown',
		});
	}
}

function generateOrganic(els, dna, rng, h, phase) {
	const swayX = rngRange(rng, -8, 8);
	const d = `M 0 0 C ${rngRange(rng, -5, 5)} ${-h * 0.33} ${swayX + rngRange(rng, -3, 3)} ${-h * 0.66} ${swayX} ${-h}`;

	els.push({
		type: 'path',
		d,
		stroke: dna.primaryColor,
		strokeWidth: 2.5,
		fill: 'none',
		className: 'plant-stem',
	});

	// Leaves scale with phase
	const maxLeaves = dna.branching + 1;
	const leafCount = Math.max(1, Math.round(maxLeaves * phase));
	for (let i = 0; i < leafCount; i++) {
		const t = 0.25 + (i / maxLeaves) * 0.65;
		const lx = swayX * t + rngRange(rng, -2, 2);
		const ly = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;
		const maxLeafSize = 6 + 12 + dna.complexity * 2;
		const leafSize = (6 + rngRange(rng, 0, 6 + dna.complexity * 2)) * Math.min(1, phase + 0.3);
		const angle = dir * rngRange(rng, 20, 50);

		els.push({
			type: 'ellipse',
			cx: lx + dir * leafSize * 0.6,
			cy: ly,
			rx: leafSize,
			ry: leafSize * 0.35,
			fill: dna.secondaryColor,
			opacity: rngRange(rng, 0.3, 0.5) + phase * 0.25,
			transform: `rotate(${angle} ${lx + dir * leafSize * 0.6} ${ly})`,
			className: 'plant-leaf',
		});
	}

	// Crown blob: appears from phase 0.4+
	if (phase >= 0.4) {
		const topR = (5 + dna.complexity * 1.5) * Math.min(1, (phase - 0.4) / 0.6);
		els.push({
			type: 'circle',
			cx: swayX,
			cy: -h - topR * 0.3,
			r: topR,
			fill: dna.primaryColor,
			opacity: 0.4 + phase * 0.3,
			className: 'plant-crown',
		});
	}
}

function generateFlowering(els, dna, rng, h, phase) {
	const swayX = rngRange(rng, -5, 5);
	const d = `M 0 0 Q ${swayX * 0.5} ${-h * 0.5} ${swayX} ${-h}`;

	els.push({
		type: 'path',
		d,
		stroke: '#3ECF8E',
		strokeWidth: 2,
		fill: 'none',
		className: 'plant-stem',
	});

	// Leaves: scale count with phase
	const maxLeaves = Math.max(2, dna.branching - 1);
	const leafCount = Math.max(0, Math.round(maxLeaves * phase));
	for (let i = 0; i < leafCount; i++) {
		const t = 0.3 + (i / maxLeaves) * 0.5;
		const lx = swayX * t;
		const ly = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;
		const leafW = 6 * Math.min(1, phase + 0.2);

		els.push({
			type: 'ellipse',
			cx: lx + dir * 8,
			cy: ly,
			rx: leafW,
			ry: 2.5,
			fill: '#2DD4BF',
			opacity: 0.3 + phase * 0.3,
			transform: `rotate(${dir * 30} ${lx + dir * 8} ${ly})`,
			className: 'plant-leaf',
		});
	}

	// Flower: appears from phase 0.5+
	if (phase >= 0.5) {
		const flowerProgress = (phase - 0.5) * 2; // 0 -> 1 in second half
		const petalCount = Math.max(3, Math.round((4 + dna.complexity) * flowerProgress));
		const petalR = (4 + dna.complexity * 1.2) * flowerProgress;
		const cx = swayX;
		const cy = -h;

		for (let i = 0; i < petalCount; i++) {
			const angle = (360 / petalCount) * i + rngRange(rng, -10, 10);
			const rad = (angle * Math.PI) / 180;
			const px = cx + Math.cos(rad) * petalR * 0.8;
			const py = cy + Math.sin(rad) * petalR * 0.8;

			els.push({
				type: 'ellipse',
				cx: px,
				cy: py,
				rx: petalR * 0.7,
				ry: petalR * 0.35,
				fill: dna.primaryColor,
				opacity: rngRange(rng, 0.4, 0.7) * flowerProgress,
				transform: `rotate(${angle} ${px} ${py})`,
				className: 'plant-leaf',
			});
		}

		// Center
		if (petalR > 1) {
			els.push({
				type: 'circle',
				cx,
				cy,
				r: petalR * 0.3,
				fill: dna.secondaryColor,
				opacity: flowerProgress,
				className: 'plant-crown',
			});
		}
	}
}

function generateCrystalline(els, dna, rng, h, phase) {
	const tilt = rngRange(rng, -3, 3);

	els.push({
		type: 'line',
		x1: 0, y1: 0,
		x2: tilt, y2: -h,
		stroke: dna.primaryColor,
		strokeWidth: 2,
		className: 'plant-stem',
	});

	// Crystals along stem: scale count with phase
	const maxCrystals = dna.branching;
	const crystalCount = Math.max(0, Math.round(maxCrystals * phase));
	for (let i = 0; i < crystalCount; i++) {
		const t = 0.3 + (i / maxCrystals) * 0.55;
		const cx = tilt * t;
		const cy = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;
		const size = rngRange(rng, 5, 10 + dna.complexity) * Math.min(1, phase + 0.2);
		const angle = rngRange(rng, -20, 20);

		const pts = [
			`${cx + dir * size * 0.3},${cy - size}`,
			`${cx + dir * size},${cy}`,
			`${cx + dir * size * 0.3},${cy + size * 0.4}`,
			`${cx},${cy}`,
		].join(' ');

		els.push({
			type: 'polygon',
			points: pts,
			fill: dna.secondaryColor,
			opacity: (rngRange(rng, 0.2, 0.4) + phase * 0.25),
			transform: `rotate(${angle} ${cx + dir * size * 0.5} ${cy})`,
			className: 'plant-leaf',
		});
	}

	// Top crystal cluster: appears from phase 0.45+
	if (phase >= 0.45) {
		const clusterProgress = (phase - 0.45) / 0.55;
		const topX = tilt;
		const topY = -h;
		const mainSize = (6 + dna.complexity * 2) * clusterProgress;

		for (let i = 0; i < 3; i++) {
			const angle = -90 + (i - 1) * rngRange(rng, 20, 35);
			const rad = (angle * Math.PI) / 180;
			const tipX = topX + Math.cos(rad) * mainSize;
			const tipY = topY + Math.sin(rad) * mainSize;

			els.push({
				type: 'polygon',
				points: `${topX - 2},${topY} ${tipX},${tipY} ${topX + 2},${topY}`,
				fill: dna.primaryColor,
				opacity: rngRange(rng, 0.4, 0.7) * clusterProgress,
				className: 'plant-crown',
			});
		}
	}
}
