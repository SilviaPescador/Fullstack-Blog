import { createRng, rngRange } from './gardenUtils';
import { resolveSpecies, getWaterGrowth, STEM_COLOR, LEAF_COLOR } from './flowerSpecies';

export function generatePlant(dna, waterCount = 0) {
	const rng = createRng(dna.seed || 0);
	const { spec } = resolveSpecies(dna);
	const water = getWaterGrowth(waterCount);
	const swayAmp = spec.sway ?? 5;
	const swayX = rngRange(rng, -swayAmp, swayAmp);
	const height = Math.min(5, Math.max(1, Number(dna.height) || 3));
	const h = Math.round(72 + height * 14 + water.stemExtra);
	const bloomScale = water.bloomScale * 2.2;

	const els = [];
	drawStem(els, spec.stem, swayX, h, spec.stemW * 1.45);
	drawLeaves(els, swayX, h, spec, water.extraLeaves);
	drawCalyx(els, swayX, -h);
	const primary = dna.primaryColor || '#F472B6';
	const secondary = dna.secondaryColor || '#FDE68A';
	drawBloom(els, swayX, -h, spec.bloom, primary, secondary, bloomScale, rng);
	if (water.dew) drawDew(els, swayX, h, rng);
	if (water.sparkle) drawSparkle(els, swayX, -h, secondary, rng);

	return { elements: els, totalHeight: h + bloomPadding(spec.bloom, bloomScale) };
}

function drawStem(els, style, swayX, h, width) {
	if (style === 'angular') {
		els.push({
			type: 'polyline',
			points: `0,0 ${swayX * 0.35},${(-h * 0.38).toFixed(1)} ${swayX * 0.75},${(-h * 0.72).toFixed(1)} ${swayX},${-h}`,
			stroke: STEM_COLOR,
			strokeWidth: width,
			fill: 'none',
			strokeLinejoin: 'round',
			className: 'plant-stem',
		});
		return;
	}

	if (style === 'straight') {
		els.push({
			type: 'line',
			x1: 0, y1: 0, x2: swayX, y2: -h,
			stroke: STEM_COLOR,
			strokeWidth: width,
			strokeLinecap: 'round',
			className: 'plant-stem',
		});
		return;
	}

	els.push({
		type: 'path',
		d: `M 0 0 Q ${swayX * 0.5} ${-h * 0.5} ${swayX} ${-h}`,
		stroke: STEM_COLOR,
		strokeWidth: width,
		fill: 'none',
		strokeLinecap: 'round',
		className: 'plant-stem',
	});
}

function drawLeaves(els, swayX, h, spec, extra) {
	const total = spec.leaf.count + extra;
	for (let i = 0; i < total; i++) {
		const t = 0.28 + (i / Math.max(1, total - 1)) * 0.44;
		const lx = swayX * t;
		const ly = -h * t;
		const dir = i % 2 === 0 ? 1 : -1;
		const scale = i >= spec.leaf.count ? 0.85 : 1;
		drawLeaf(els, lx, ly, dir, spec.leaf, scale);
	}
}

function drawLeaf(els, lx, ly, dir, leaf, scale) {
	const angle = dir * (leaf.angle || 32);
	const rx = leaf.rx * scale * 1.7;
	const ry = leaf.ry * scale * 1.7;

	if (leaf.shape === 'rect') {
		const cx = lx + dir * 6;
		els.push({
			type: 'rect',
			x: cx - rx / 2,
			y: ly - ry / 2,
			width: rx,
			height: ry,
			fill: LEAF_COLOR,
			opacity: 0.75,
			transform: `rotate(${angle + 45} ${cx} ${ly})`,
			className: 'plant-node',
		});
		return;
	}

	if (leaf.shape === 'shard') {
		const tipX = lx + dir * rx;
		const tipY = ly - 2;
		els.push({
			type: 'polygon',
			points: `${lx},${ly} ${tipX},${tipY - ry} ${tipX},${tipY + ry}`,
			fill: LEAF_COLOR,
			opacity: 0.7,
			className: 'plant-leaf',
		});
		return;
	}

	const cx = lx + dir * rx * 0.7;
	els.push({
		type: 'ellipse',
		cx,
		cy: ly,
		rx,
		ry,
		fill: LEAF_COLOR,
		opacity: 0.72,
		transform: `rotate(${angle} ${cx} ${ly})`,
		className: 'plant-leaf',
	});
}

function drawCalyx(els, cx, cy) {
	[-1, 1].forEach((dir) => {
		els.push({
			type: 'ellipse',
			cx: cx + dir * 5,
			cy: cy + 3,
			rx: 7,
			ry: 3.2,
			fill: LEAF_COLOR,
			opacity: 0.7,
			transform: `rotate(${dir * 40} ${cx} ${cy + 3})`,
			className: 'plant-leaf',
		});
	});
}

function drawBloom(els, cx, cy, bloom, primary, secondary, scale, rng) {
	switch (bloom.kind) {
		case 'cup':
			bloomCup(els, cx, cy, bloom, primary, secondary, scale);
			break;
		case 'pointed':
			bloomPointed(els, cx, cy, bloom, primary, secondary, scale, rng);
			break;
		case 'layered':
			bloomLayered(els, cx, cy, bloom, primary, secondary, scale, rng);
			break;
		case 'crystal':
			bloomCrystal(els, cx, cy, bloom, primary, secondary, scale);
			break;
		case 'cluster':
			bloomCluster(els, cx, cy, bloom, primary, secondary, scale);
			break;
		default:
			bloomRadial(els, cx, cy, bloom, primary, secondary, scale, rng);
	}
}

function bloomRadial(els, cx, cy, bloom, primary, secondary, scale, rng) {
	const n = bloom.n;
	const r = bloom.r * scale;
	const rot = rngRange(rng, -6, 6);
	for (let i = 0; i < n; i++) {
		const angle = (360 / n) * i + rot;
		const rad = (angle * Math.PI) / 180;
		const px = cx + Math.cos(rad) * r;
		const py = cy + Math.sin(rad) * r;
		if (bloom.shape === 'diamond') {
			const s = (bloom.size || 5) * scale;
			els.push({
				type: 'polygon',
				points: `${px},${py - s} ${px + s * 0.45},${py} ${px},${py + s * 0.45} ${px - s * 0.45},${py}`,
				fill: primary,
				opacity: 0.92,
				transform: `rotate(${angle} ${px} ${py})`,
				className: 'plant-petal',
			});
		} else {
			els.push({
				type: 'ellipse',
				cx: px,
				cy: py,
				rx: bloom.rx * scale,
				ry: bloom.ry * scale,
				fill: primary,
				opacity: 0.92,
				transform: `rotate(${angle} ${px} ${py})`,
				className: 'plant-petal',
			});
		}
	}
	drawCenter(els, cx, cy, bloom, secondary, scale);
}

function bloomLayered(els, cx, cy, bloom, primary, secondary, scale, rng) {
	bloomRadial(els, cx, cy, { ...bloom.outer, shape: bloom.shape, centerR: 0 }, primary, secondary, scale, rng);
	bloomRadial(els, cx, cy, { ...bloom.inner, shape: bloom.shape, centerR: bloom.centerR, center: bloom.center }, secondary, primary, scale, rng);
}

function bloomCup(els, cx, cy, bloom, primary, secondary, scale) {
	const h = bloom.h * scale;
	const w = bloom.w * scale;
	const spread = bloom.bell ? 18 : 30;
	[-spread, 0, spread].forEach((angle, i) => {
		const mid = i === 1;
		els.push({
			type: 'ellipse',
			cx,
			cy: cy - h * 0.42,
			rx: w * (mid ? 0.52 : 0.4),
			ry: h * 0.52,
			fill: mid ? secondary : primary,
			opacity: mid ? 0.95 : 0.78,
			transform: `rotate(${angle} ${cx} ${cy})`,
			className: 'plant-petal',
		});
	});
}

function bloomPointed(els, cx, cy, bloom, primary, secondary, scale, rng) {
	const n = bloom.n;
	const r = bloom.r * scale;
	for (let i = 0; i < n; i++) {
		const angle = (360 / n) * i - 90 + rngRange(rng, -4, 4);
		const rad = (angle * Math.PI) / 180;
		const px = cx + Math.cos(rad) * r * 0.55;
		const py = cy + Math.sin(rad) * r * 0.55;
		els.push({
			type: 'ellipse',
			cx: px,
			cy: py,
			rx: bloom.rx * scale,
			ry: bloom.ry * scale,
			fill: primary,
			opacity: 0.8,
			transform: `rotate(${angle} ${px} ${py})`,
			className: 'plant-petal',
		});
	}
	if (bloom.stamens) {
		for (let i = 0; i < bloom.stamens; i++) {
			const angle = (360 / bloom.stamens) * i - 90;
			const rad = (angle * Math.PI) / 180;
			const len = r * 0.7;
			const ex = cx + Math.cos(rad) * len;
			const ey = cy + Math.sin(rad) * len;
			els.push({
				type: 'line',
				x1: cx, y1: cy, x2: ex, y2: ey,
				stroke: secondary,
				strokeWidth: 0.8,
				strokeLinecap: 'round',
				className: 'plant-petal',
			});
			els.push({
				type: 'circle',
				cx: ex,
				cy: ey,
				r: 1.3 * scale,
				fill: secondary,
				className: 'plant-crown',
			});
		}
	}
	drawCenter(els, cx, cy, bloom, secondary, scale);
}

function bloomCrystal(els, cx, cy, bloom, primary, secondary, scale) {
	const n = bloom.n;
	const size = bloom.size * scale;
	if (n === 1) {
		els.push({
			type: 'polygon',
			points: `${cx - 3.2},${cy} ${cx},${cy - size} ${cx + 3.2},${cy}`,
			fill: primary,
			opacity: 0.88,
			className: 'plant-crown',
		});
		return;
	}
	const fan = n <= 3;
	const step = fan ? 48 : 360 / n;
	const start = fan ? -90 - ((n - 1) * step) / 2 : -90;
	for (let i = 0; i < n; i++) {
		const angle = start + i * step;
		const rad = (angle * Math.PI) / 180;
		const tipX = cx + Math.cos(rad) * size;
		const tipY = cy + Math.sin(rad) * size;
		els.push({
			type: 'polygon',
			points: `${cx - 2.2},${cy} ${tipX},${tipY} ${cx + 2.2},${cy}`,
			fill: i % 2 ? secondary : primary,
			opacity: 0.75,
			className: 'plant-petal',
		});
	}
	els.push({
		type: 'circle',
		cx,
		cy,
		r: 2.2 * scale,
		fill: secondary,
		className: 'plant-crown',
	});
}

function bloomCluster(els, cx, cy, bloom, primary, secondary, scale) {
	const spread = bloom.spread * scale;
	const r = bloom.r * scale;
	els.push({
		type: 'circle',
		cx,
		cy,
		r,
		fill: secondary,
		className: 'plant-crown',
	});
	for (let i = 0; i < bloom.n - 1; i++) {
		const angle = (360 / (bloom.n - 1)) * i - 90;
		const rad = (angle * Math.PI) / 180;
		els.push({
			type: 'circle',
			cx: cx + Math.cos(rad) * spread,
			cy: cy + Math.sin(rad) * spread,
			r: r * 0.85,
			fill: i % 2 ? secondary : primary,
			opacity: 0.85,
			className: 'plant-petal',
		});
	}
}

function drawCenter(els, cx, cy, bloom, fill, scale) {
	if (!bloom.centerR) return;
	if (bloom.center === 'square') {
		const s = bloom.centerR * scale;
		els.push({
			type: 'rect',
			x: cx - s,
			y: cy - s,
			width: s * 2,
			height: s * 2,
			fill,
			transform: `rotate(45 ${cx} ${cy})`,
			className: 'plant-crown',
		});
		return;
	}
	els.push({
		type: 'circle',
		cx,
		cy,
		r: bloom.centerR * scale,
		fill,
		className: 'plant-crown',
	});
}

function drawDew(els, swayX, h, rng) {
	for (let i = 0; i < 2; i++) {
		const t = 0.42 + i * 0.18;
		els.push({
			type: 'circle',
			cx: swayX * t + rngRange(rng, -3, 3),
			cy: -h * t,
			r: 1.4,
			fill: '#E0F2FE',
			opacity: 0.55,
			className: 'plant-dew',
		});
	}
}

function drawSparkle(els, cx, cy, color, rng) {
	const spots = [[12, -10], [-14, -6], [8, 8]];
	spots.forEach(([dx, dy]) => {
		const x = cx + dx + rngRange(rng, -2, 2);
		const y = cy + dy;
		const s = 2.2;
		els.push({
			type: 'polygon',
			points: `${x},${y - s} ${x + 0.7},${y - 0.7} ${x + s},${y} ${x + 0.7},${y + 0.7} ${x},${y + s} ${x - 0.7},${y + 0.7} ${x - s},${y} ${x - 0.7},${y - 0.7}`,
			fill: color,
			opacity: 0.7,
			className: 'plant-sparkle',
		});
	});
}

function bloomPadding(bloom, scale) {
	if (bloom.kind === 'cup') return bloom.h * scale + 4;
	if (bloom.kind === 'crystal') return bloom.size * scale + 6;
	if (bloom.kind === 'cluster') return (bloom.spread + bloom.r) * scale + 4;
	if (bloom.kind === 'layered') {
		const outer = bloom.outer;
		return ((outer.r || 0) + (outer.rx || outer.size || 4)) * scale + 4;
	}
	if (bloom.kind === 'pointed') return (bloom.r + bloom.ry) * scale * 0.55 + 4;
	return ((bloom.r || 0) + (bloom.rx || bloom.size || 4)) * scale + 6;
}
