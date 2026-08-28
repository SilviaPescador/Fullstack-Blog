export function renderSvgElement(el, i) {
	const s = { transition: 'opacity 0.3s' };
	const cls = el.className || '';
	const o = el.opacity;
	const common = { opacity: o, className: cls, style: s };

	let shape = null;
	switch (el.type) {
		case 'path':
			shape = <path {...common} d={el.d} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill || 'none'} strokeLinecap={el.strokeLinecap} />;
			break;
		case 'line':
			shape = <line {...common} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={el.stroke} strokeWidth={el.strokeWidth} strokeLinecap={el.strokeLinecap} />;
			break;
		case 'polyline':
			shape = <polyline {...common} points={el.points} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill || 'none'} strokeLinejoin={el.strokeLinejoin} />;
			break;
		case 'circle':
			shape = <circle {...common} cx={el.cx} cy={el.cy} r={el.r} fill={el.fill} />;
			break;
		case 'ellipse':
			shape = <ellipse {...common} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} fill={el.fill} />;
			break;
		case 'rect':
			shape = <rect {...common} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} />;
			break;
		case 'polygon':
			shape = <polygon {...common} points={el.points} fill={el.fill} />;
			break;
		default:
			return null;
	}

	return <g key={i} transform={el.transform}>{shape}</g>;
}
