// Seeded PRNG (mulberry32) for deterministic randomness per plant
export function createRng(seed) {
	let s = seed | 0;
	return () => {
		s = (s + 0x6D2B79F5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function rngRange(rng, min, max) {
	return min + rng() * (max - min);
}

export function rngInt(rng, min, max) {
	return Math.floor(rngRange(rng, min, max + 1));
}

const SLOT_WIDTH = 46;
const GARDEN_PADDING = 72;
export const GARDEN_GROUND = 20;

export const PLANES = [
	{ yOffset: -54, scale: 0.7, opacity: 0.75 },
	{ yOffset: -26, scale: 0.86, opacity: 0.9 },
	{ yOffset: 0, scale: 1, opacity: 1 },
];

export function calculateGardenLayout(plants, viewportWidth, gardenHeight) {
	const count = plants.length;
	const groundY = gardenHeight - GARDEN_GROUND;
	const packed = count * SLOT_WIDTH;
	const worldWidth = Math.max(viewportWidth, packed + GARDEN_PADDING * 2);
	const startX = packed + GARDEN_PADDING * 2 <= viewportWidth
		? (viewportWidth - packed) / 2
		: GARDEN_PADDING;

	if (count === 0) {
		return { positions: [], worldWidth, needsPan: false };
	}

	const positions = plants.map((plant, i) => {
		const rng = createRng(plant.seed || i * 7919);
		const plane = rngInt(rng, 0, 2);
		const spec = PLANES[plane];
		const jitterX = rngRange(rng, -SLOT_WIDTH * 0.14, SLOT_WIDTH * 0.14);
		return {
			x: startX + SLOT_WIDTH * 0.5 + i * SLOT_WIDTH + jitterX,
			y: groundY + spec.yOffset,
			plane,
			scale: spec.scale,
			opacity: spec.opacity,
		};
	});

	return {
		positions,
		worldWidth,
		needsPan: worldWidth > viewportWidth + 1,
	};
}

export const BLOOM_CENTER_COLOR = '#FDE68A';

export const PETAL_COLORS = [
	'#F472B6',
	'#FB7185',
	'#E879F9',
	'#C084FC',
	'#A78BFA',
	'#818CF8',
	'#6C9CFF',
	'#38BDF8',
	'#FACC15',
	'#FBBF24',
	'#E8A87C',
	'#F97316',
];

const GREEN_PETAL_HEX = new Set([
	'#3ECF8E', '#2DD4BF', '#34D399', '#10B981', '#22C55E',
	'#4ADE80', '#6EE7B7', '#A7F3D0', '#86EFAC',
]);

export function pickPetalColors(seed) {
	const rng = createRng(seed || 1);
	const i = rngInt(rng, 0, PETAL_COLORS.length - 1);
	let j = rngInt(rng, 0, PETAL_COLORS.length - 1);
	if (j === i) j = (j + 4) % PETAL_COLORS.length;
	return { primaryColor: PETAL_COLORS[i], secondaryColor: PETAL_COLORS[j] };
}

export function resolvePetalColors(dna) {
	const primary = dna?.primaryColor;
	const secondary = dna?.secondaryColor;
	if (primary && secondary && !GREEN_PETAL_HEX.has(primary.toUpperCase()) && !GREEN_PETAL_HEX.has(secondary.toUpperCase())) {
		return { primaryColor: primary, secondaryColor: secondary };
	}
	return pickPetalColors(Number(dna?.seed) || 1);
}

export function defaultVisualDna(postId, title = '', content = '') {
	const hash = simpleHash(postId + title);
	const len = (content || '').length;
	const types = ['geometric', 'organic', 'flowering', 'crystalline'];
	const seed = Math.floor(Math.random() * 90000) + 1;
	const { primaryColor, secondaryColor } = pickPetalColors(seed);

	return {
		type: types[hash % 4],
		height: Math.min(5, Math.max(1, Math.floor(len / 200) + 1)),
		complexity: Math.min(5, Math.max(1, Math.floor(len / 300) + 1)),
		primaryColor,
		secondaryColor,
		seed,
	};
}

function simpleHash(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + ch;
		hash |= 0;
	}
	return Math.abs(hash);
}
