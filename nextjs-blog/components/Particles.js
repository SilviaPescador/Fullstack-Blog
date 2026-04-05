'use client';

import { useEffect } from 'react';

function createParticle(container) {
	const el = document.createElement('div');
	el.classList.add('particle');

	const x = Math.random() * 100;
	const y = Math.random() * 100;
	const duration = 6 + Math.random() * 12;
	const delay = Math.random() * 10;
	const opacity = 0.2 + Math.random() * 0.5;
	const driftX = -50 + Math.random() * 100;
	const driftY = -100 - Math.random() * 150;
	const size = 1.5 + Math.random() * 3.5;

	const rand = Math.random();
	let color;
	if (rand < 0.35) color = `rgba(62, 207, 142, ${opacity})`;
	else if (rand < 0.6) color = `rgba(45, 212, 191, ${opacity * 0.8})`;
	else if (rand < 0.85) color = `rgba(108, 156, 255, ${opacity * 0.7})`;
	else color = `rgba(232, 168, 124, ${opacity * 0.6})`;

	el.style.cssText = `
		left: ${x}%;
		top: ${y}%;
		width: ${size}px;
		height: ${size}px;
		background: ${color};
		box-shadow: 0 0 ${size * 3}px ${color};
		--particle-duration: ${duration}s;
		--particle-delay: ${delay}s;
		--particle-opacity: ${opacity};
		--particle-drift-x: ${driftX}px;
		--particle-drift-y: ${driftY}px;
	`;

	container.appendChild(el);
}

export default function Particles() {
	useEffect(() => {
		const container = document.getElementById('particles-container');
		if (!container) return;

		const isMobile = window.innerWidth < 768;
		const count = isMobile ? 15 : 30;
		for (let i = 0; i < count; i++) createParticle(container);

		return () => { container.innerHTML = ''; };
	}, []);

	return <div id="particles-container" />;
}
