'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PlantPreview from '@/components/garden/PlantPreview';
import { SPECIES, FAMILIES } from '@/components/garden/flowerSpecies';
import Icon from '@/components/Icons';

const FAMILY_META = {
	flowering: { label: 'Creativa', hint: 'Posts artisticos', primary: '#F472B6', secondary: '#FDE68A' },
	organic: { label: 'Reflexiva', hint: 'Posts personales', primary: '#34D399', secondary: '#A7F3D0' },
	geometric: { label: 'Tecnica', hint: 'Posts de codigo', primary: '#6C9CFF', secondary: '#C4B5FD' },
	crystalline: { label: 'Educativa', hint: 'Recursos y guias', primary: '#67E8F9', secondary: '#A78BFA' },
};

function sampleDna(type, complexity) {
	const colors = FAMILY_META[type];
	return {
		type,
		complexity,
		height: 3,
		primaryColor: colors.primary,
		secondaryColor: colors.secondary,
		seed: type.length * 97 + complexity * 13,
	};
}

export default function PlantCatalogPage() {
	const [ready, setReady] = useState(false);
	const [water, setWater] = useState(0);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		const init = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { router.push('/login'); return; }
			const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
			if (profile?.role !== 'admin') { router.push('/'); return; }
			setReady(true);
		};
		init();
	}, [router, supabase]);

	if (!ready) {
		return (
			<div className="container py-4">
				<div className="flex-center py-8"><span className="spinner spinner--lg" /></div>
			</div>
		);
	}

	return (
		<div className="container py-4">
			<div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
				<h1 className="flex items-center gap-3">
					<Icon name="flower" size={24} /> Prototipos de flores
				</h1>
				<label className="flex items-center gap-3" style={{ fontSize: 'var(--text-sm)' }}>
					Riegos: {water}
					<input
						type="range"
						min="0"
						max="12"
						value={water}
						onChange={(e) => setWater(Number(e.target.value))}
						style={{ width: '160px' }}
					/>
				</label>
			</div>

			<p className="text-sm text-muted mb-6">
				La flor nace completa. El riego alarga el tallo, anade hojas y, a partir de 4 y 8 riegos, rocio y destellos.
			</p>

			<div className="flex-col gap-6">
				{FAMILIES.map((type) => (
					<section key={type} className="card" style={{ padding: 'var(--space-md)' }}>
						<h2 style={{ fontSize: 'var(--text-lg)', marginBottom: '4px' }}>{FAMILY_META[type].label}</h2>
						<p className="text-xs text-muted mb-4">{FAMILY_META[type].hint} · {type}</p>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--space-md)', alignItems: 'end' }}>
							{[1, 2, 3, 4, 5].map((complexity) => {
								const spec = SPECIES[type][complexity];
								return (
									<div key={spec.id} className="text-center">
										<PlantPreview dna={sampleDna(type, complexity)} waterCount={water} width={120} maxHeight={280} />
										<p className="text-xs" style={{ fontWeight: 600, marginTop: 'var(--space-xs)' }}>{spec.label}</p>
										<p className="text-xs text-muted">complejidad {complexity}</p>
									</div>
								);
							})}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
