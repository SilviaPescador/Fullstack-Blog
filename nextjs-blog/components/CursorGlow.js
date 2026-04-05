'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
	const glowRef = useRef(null);

	useEffect(() => {
		const el = glowRef.current;
		if (!el) return;

		const isTouch = window.matchMedia('(hover: none)').matches;
		if (isTouch) { el.style.display = 'none'; return; }

		let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
		let rafId;

		const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
		const onEnter = () => { el.style.opacity = '1'; };
		const onLeave = () => { el.style.opacity = '0'; };

		function animate() {
			glowX += (mouseX - glowX) * 0.08;
			glowY += (mouseY - glowY) * 0.08;
			el.style.transform = `translate(${glowX - 250}px, ${glowY - 250}px)`;
			rafId = requestAnimationFrame(animate);
		}

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseenter', onEnter);
		document.addEventListener('mouseleave', onLeave);
		rafId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(rafId);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseenter', onEnter);
			document.removeEventListener('mouseleave', onLeave);
		};
	}, []);

	return <div ref={glowRef} id="cursor-glow" />;
}
