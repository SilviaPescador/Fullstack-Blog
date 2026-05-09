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

// Calculate plant positions in the garden SVG to avoid overlap
export function calculatePlantPositions(plants, gardenWidth, gardenHeight) {
	const groundY = gardenHeight - 20;
	const padding = 40;
	const usableWidth = gardenWidth - padding * 2;
	const count = plants.length;

	if (count === 0) return [];

	const positions = [];
	const minSpacing = Math.max(30, usableWidth / (count + 1));

	for (let i = 0; i < count; i++) {
		const rng = createRng(plants[i].seed || i * 7919);
		const baseX = padding + ((i + 0.5) / count) * usableWidth;
		const jitterX = rngRange(rng, -minSpacing * 0.2, minSpacing * 0.2);
		const x = Math.max(padding, Math.min(gardenWidth - padding, baseX + jitterX));
		positions.push({ x, y: groundY });
	}

	return positions;
}

// Default visual DNA for posts that don't have AI-generated DNA yet
export function defaultVisualDna(postId, title = '', content = '') {
	const hash = simpleHash(postId + title);
	const len = (content || '').length;

	const types = ['geometric', 'organic', 'flowering', 'crystalline'];
	const type = types[hash % 4];

	const greens = ['#3ECF8E', '#2DD4BF', '#6C9CFF', '#E8A87C', '#A78BFA', '#F472B6'];
	const primaryColor = greens[hash % greens.length];
	const secondaryColor = greens[(hash + 3) % greens.length];

	return {
		type,
		height: Math.min(5, Math.max(1, Math.floor(len / 200) + 1)),
		complexity: Math.min(5, Math.max(1, Math.floor(len / 300) + 1)),
		branching: Math.min(5, Math.max(2, (hash % 4) + 1)),
		primaryColor,
		secondaryColor,
		seed: hash,
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
