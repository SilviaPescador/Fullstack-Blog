import { createRng, rngRange, rngInt } from './gardenUtils';

// Generate SVG elements for a plant based on its visual DNA
export function generatePlant(dna) {
	const rng = createRng(dna.seed || 0);
	const h = 30 + dna.height * 18; // total height 48-120
	const elements = [];

	switch (dna.type) {
		case 'geometric':
			generateGeometric(elements, dna, rng, h);
			break;
		case 'organic':
			generateOrganic(elements, dna, rng, h);
			break;
		case 'flowering':
			generateFlowering(elements, dna, rng, h);
			break;
		case 'crystalline':
			generateCrystalline(elements, dna, rng, h);
			break;
		default:
			generateOrganic(elements, dna, rng, h);
	}

	return { elements, totalHeight: h };
}

function generateGeometric(els, dna, rng, h) {
	// Angular stem
	const segments = 2 + dna.complexity;
	let y = 0;
	let x = 0;
	const segH = h / segments;
	const points = [[0, 0]];

	for (let i = 1; i <= segments; i++) {
		x += rngRange(rng, -4, 4);
		y -= segH;
		points.push([x, y]);
	}

	// Stem as polyline
	els.push({
		type: 'polyline',
		points: points.map(p => p.join(',')).join(' '),
		stroke: dna.primaryColor,
		strokeWidth: 2,
		fill: 'none',
		className: 'plant-stem',
	});

	// Circuit-like nodes at joints
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

		// Branches: small lines extending from nodes
		if (i < points.length - 1 && rng() > 0.3) {
			const dir = rng() > 0.5 ? 1 : -1;
			const bLen = rngRange(rng, 8, 16 + dna.branching * 3);
			els.push({
				type: 'line',
				x1: px, y1: py,
				x2: px + dir * bLen, y2: py - rngRange(rng, 0, 6),
				stroke: dna.primaryColor,
				strokeWidth: 1.5,
				opacity: 0.7,
				className: 'plant-branch',
			});
			// Terminal node
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

	// Top element: diamond
	const [tx, ty] = points[points.length - 1];
	const ds = 4 + dna.complexity;
	els.push({
		type: 'polygon',
		points: `${tx},${ty - ds} ${tx + ds},${ty} ${tx},${ty + ds * 0.3} ${tx - ds},${ty}`,
		fill: dna.secondaryColor,
		opacity: 0.9,
		className: 'plant-crown',
	});
}

function generateOrganic(els, dna, rng, h) {
	// Curved stem using cubic bezier
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

	// Leaves along the stem
	const leafCount = dna.branching + 1;
	for (let i = 0; i < leafCount; i++) {
		const t = 0.25 + (i / leafCount) * 0.65;
		const lx = swayX * t + rngRange(rng, -2, 2);
		const ly = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;
		const leafSize = rngRange(rng, 6, 12 + dna.complexity * 2);
		const angle = dir * rngRange(rng, 20, 50);

		els.push({
			type: 'ellipse',
			cx: lx + dir * leafSize * 0.6,
			cy: ly,
			rx: leafSize,
			ry: leafSize * 0.35,
			fill: dna.secondaryColor,
			opacity: rngRange(rng, 0.4, 0.7),
			transform: `rotate(${angle} ${lx + dir * leafSize * 0.6} ${ly})`,
			className: 'plant-leaf',
		});
	}

	// Top: organic blob
	const topR = 5 + dna.complexity * 1.5;
	els.push({
		type: 'circle',
		cx: swayX,
		cy: -h - topR * 0.3,
		r: topR,
		fill: dna.primaryColor,
		opacity: 0.6,
		className: 'plant-crown',
	});
}

function generateFlowering(els, dna, rng, h) {
	// Gently curved stem
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

	// Small leaves
	const leafCount = Math.max(2, dna.branching - 1);
	for (let i = 0; i < leafCount; i++) {
		const t = 0.3 + (i / leafCount) * 0.5;
		const lx = swayX * t;
		const ly = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;

		els.push({
			type: 'ellipse',
			cx: lx + dir * 8,
			cy: ly,
			rx: 6,
			ry: 2.5,
			fill: '#2DD4BF',
			opacity: 0.5,
			transform: `rotate(${dir * 30} ${lx + dir * 8} ${ly})`,
			className: 'plant-leaf',
		});
	}

	// Flower petals at top
	const petalCount = 4 + dna.complexity;
	const petalR = 4 + dna.complexity * 1.2;
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
			opacity: rngRange(rng, 0.5, 0.8),
			transform: `rotate(${angle} ${px} ${py})`,
			className: 'plant-leaf',
		});
	}

	// Center
	els.push({
		type: 'circle',
		cx,
		cy,
		r: petalR * 0.3,
		fill: dna.secondaryColor,
		className: 'plant-crown',
	});
}

function generateCrystalline(els, dna, rng, h) {
	// Straight stem with slight angle
	const tilt = rngRange(rng, -3, 3);

	els.push({
		type: 'line',
		x1: 0, y1: 0,
		x2: tilt, y2: -h,
		stroke: dna.primaryColor,
		strokeWidth: 2,
		className: 'plant-stem',
	});

	// Faceted crystals along stem
	const crystalCount = dna.branching;
	for (let i = 0; i < crystalCount; i++) {
		const t = 0.3 + (i / crystalCount) * 0.55;
		const cx = tilt * t;
		const cy = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;
		const size = rngRange(rng, 5, 10 + dna.complexity);
		const angle = rngRange(rng, -20, 20);

		// Diamond shape
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
			opacity: rngRange(rng, 0.3, 0.6),
			transform: `rotate(${angle} ${cx + dir * size * 0.5} ${cy})`,
			className: 'plant-leaf',
		});
	}

	// Top crystal cluster
	const topX = tilt;
	const topY = -h;
	const mainSize = 6 + dna.complexity * 2;

	for (let i = 0; i < 3; i++) {
		const angle = -90 + (i - 1) * rngRange(rng, 20, 35);
		const rad = (angle * Math.PI) / 180;
		const tipX = topX + Math.cos(rad) * mainSize;
		const tipY = topY + Math.sin(rad) * mainSize;

		els.push({
			type: 'polygon',
			points: `${topX - 2},${topY} ${tipX},${tipY} ${topX + 2},${topY}`,
			fill: dna.primaryColor,
			opacity: rngRange(rng, 0.5, 0.85),
			className: 'plant-crown',
		});
	}
}
