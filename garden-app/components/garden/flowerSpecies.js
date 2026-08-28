export const STEM_COLOR = '#3ECF8E';
export const LEAF_COLOR = '#2DD4BF';

const SPECIES = {
	flowering: {
		1: {
			id: 'daisy',
			label: 'Margarita',
			stem: 'curve',
			stemW: 2,
			sway: 5,
			leaf: { count: 2, rx: 8, ry: 2.4, angle: 32 },
			bloom: { kind: 'radial', shape: 'ellipse', n: 6, r: 6.5, rx: 5.2, ry: 2.4, centerR: 2.5 },
		},
		2: {
			id: 'tulip',
			label: 'Tulipan',
			stem: 'curve',
			stemW: 2.2,
			sway: 3,
			leaf: { count: 2, rx: 11, ry: 2.8, angle: 48 },
			bloom: { kind: 'cup', h: 14, w: 9 },
		},
		3: {
			id: 'poppy',
			label: 'Amapola',
			stem: 'curve',
			stemW: 2,
			sway: 6,
			leaf: { count: 3, rx: 8, ry: 2.5, angle: 34 },
			bloom: { kind: 'radial', shape: 'ellipse', n: 8, r: 7.5, rx: 5.8, ry: 2.8, centerR: 3.4 },
		},
		4: {
			id: 'lily',
			label: 'Lirio',
			stem: 'curve',
			stemW: 2.1,
			sway: 4,
			leaf: { count: 2, rx: 10, ry: 2.6, angle: 40 },
			bloom: { kind: 'pointed', n: 6, r: 9, rx: 2.8, ry: 7.2, stamens: 5, centerR: 2.2 },
		},
		5: {
			id: 'peony',
			label: 'Peonia',
			stem: 'curve',
			stemW: 2.3,
			sway: 5,
			leaf: { count: 3, rx: 9, ry: 2.6, angle: 36 },
			bloom: {
				kind: 'layered',
				shape: 'ellipse',
				outer: { n: 8, r: 8.5, rx: 5.4, ry: 2.4 },
				inner: { n: 6, r: 4.8, rx: 3.6, ry: 1.8 },
				centerR: 2.6,
			},
		},
	},
	organic: {
		1: {
			id: 'primrose',
			label: 'Primavera',
			stem: 'curve',
			stemW: 2,
			sway: 7,
			leaf: { count: 2, rx: 9, ry: 3, angle: 28 },
			bloom: { kind: 'radial', shape: 'ellipse', n: 5, r: 5.5, rx: 4.6, ry: 2.2, centerR: 2.2 },
		},
		2: {
			id: 'campanula',
			label: 'Campanilla',
			stem: 'curve',
			stemW: 2,
			sway: 6,
			leaf: { count: 3, rx: 8, ry: 2.6, angle: 30 },
			bloom: { kind: 'cup', h: 12, w: 8, bell: true },
		},
		3: {
			id: 'wildflower',
			label: 'Silvestre',
			stem: 'curve',
			stemW: 2.1,
			sway: 8,
			leaf: { count: 4, rx: 8.5, ry: 2.7, angle: 33 },
			bloom: { kind: 'radial', shape: 'ellipse', n: 5, r: 7, rx: 5.5, ry: 2.6, centerR: 2.8 },
		},
		4: {
			id: 'orchid',
			label: 'Orquidea',
			stem: 'curve',
			stemW: 2.1,
			sway: 6,
			leaf: { count: 4, rx: 11, ry: 3, angle: 42 },
			bloom: { kind: 'pointed', n: 5, r: 8.5, rx: 3.2, ry: 6.5, stamens: 3, centerR: 2 },
		},
		5: {
			id: 'hydrangea',
			label: 'Hortensia',
			stem: 'curve',
			stemW: 2.4,
			sway: 5,
			leaf: { count: 4, rx: 10, ry: 3.2, angle: 30 },
			bloom: { kind: 'cluster', n: 7, spread: 7.5, r: 3.2 },
		},
	},
	geometric: {
		1: {
			id: 'diamond',
			label: 'Diamante',
			stem: 'angular',
			stemW: 2,
			sway: 3,
			leaf: { count: 2, rx: 5, ry: 5, angle: 25, shape: 'rect' },
			bloom: { kind: 'radial', shape: 'diamond', n: 4, r: 6, size: 5, centerR: 2.2, center: 'square' },
		},
		2: {
			id: 'hex',
			label: 'Hexagono',
			stem: 'angular',
			stemW: 2,
			sway: 3,
			leaf: { count: 2, rx: 5.5, ry: 5.5, angle: 25, shape: 'rect' },
			bloom: { kind: 'radial', shape: 'diamond', n: 6, r: 7, size: 5.5, centerR: 2.4 },
		},
		3: {
			id: 'circuit',
			label: 'Circuito',
			stem: 'angular',
			stemW: 2.1,
			sway: 4,
			leaf: { count: 3, rx: 5, ry: 5, angle: 20, shape: 'rect' },
			bloom: { kind: 'radial', shape: 'diamond', n: 4, r: 8, size: 6, centerR: 2.6, center: 'square' },
		},
		4: {
			id: 'star',
			label: 'Estrella',
			stem: 'angular',
			stemW: 2.1,
			sway: 3,
			leaf: { count: 3, rx: 5.5, ry: 5.5, angle: 22, shape: 'rect' },
			bloom: { kind: 'radial', shape: 'diamond', n: 8, r: 8, size: 5.2, centerR: 2.5 },
		},
		5: {
			id: 'mandala',
			label: 'Mandala',
			stem: 'angular',
			stemW: 2.3,
			sway: 4,
			leaf: { count: 4, rx: 6, ry: 6, angle: 22, shape: 'rect' },
			bloom: {
				kind: 'layered',
				shape: 'diamond',
				outer: { n: 8, r: 9, size: 5.4 },
				inner: { n: 6, r: 5, size: 3.8 },
				centerR: 2.4,
				center: 'square',
			},
		},
	},
	crystalline: {
		1: {
			id: 'shard',
			label: 'Cristal',
			stem: 'straight',
			stemW: 2,
			sway: 2,
			leaf: { count: 1, rx: 8, ry: 3, angle: 20, shape: 'shard' },
			bloom: { kind: 'crystal', n: 1, size: 13 },
		},
		2: {
			id: 'twin',
			label: 'Geminis',
			stem: 'straight',
			stemW: 2,
			sway: 2,
			leaf: { count: 2, rx: 8, ry: 3, angle: 22, shape: 'shard' },
			bloom: { kind: 'crystal', n: 2, size: 12 },
		},
		3: {
			id: 'triad',
			label: 'Triada',
			stem: 'straight',
			stemW: 2.1,
			sway: 3,
			leaf: { count: 2, rx: 9, ry: 3, angle: 22, shape: 'shard' },
			bloom: { kind: 'crystal', n: 3, size: 12 },
		},
		4: {
			id: 'iceflower',
			label: 'Flor de hielo',
			stem: 'straight',
			stemW: 2.1,
			sway: 3,
			leaf: { count: 2, rx: 9, ry: 3, angle: 24, shape: 'shard' },
			bloom: { kind: 'crystal', n: 5, size: 11 },
		},
		5: {
			id: 'frost',
			label: 'Escarcha',
			stem: 'straight',
			stemW: 2.3,
			sway: 3,
			leaf: { count: 3, rx: 10, ry: 3.2, angle: 24, shape: 'shard' },
			bloom: { kind: 'crystal', n: 7, size: 12 },
		},
	},
};

const FAMILIES = Object.keys(SPECIES);

export function resolveSpecies(dna) {
	const type = FAMILIES.includes(dna?.type) ? dna.type : 'organic';
	const level = Math.min(5, Math.max(1, Math.round(Number(dna?.complexity) || 3)));
	return { type, level, spec: SPECIES[type][level] };
}

export function getSpeciesMeta(dna) {
	const { type, level, spec } = resolveSpecies(dna);
	return { type, level, id: spec.id, label: spec.label };
}

export function getWaterGrowth(waterCount) {
	const w = Math.max(0, Number(waterCount) || 0);
	const capped = Math.min(w, 12);
	return {
		stemExtra: capped * 10,
		bloomScale: 1 + Math.min(w, 10) * 0.02,
		extraLeaves: (w >= 3 ? 1 : 0) + (w >= 7 ? 1 : 0),
		dew: w >= 4,
		sparkle: w >= 8,
	};
}

export { SPECIES, FAMILIES };
