'use client';

/**
 * Componente reutilizable para mostrar mensajes de error
 * 
 * @param {string} type - Tipo de error: 'error', 'warning', 'info', 'empty'
 * @param {string} title - Título del mensaje
 * @param {string} message - Descripción del error
 * @param {string} details - Detalles técnicos (solo se muestra en desarrollo)
 * @param {function} onRetry - Función a ejecutar al hacer clic en "Reintentar"
 * @param {boolean} showHomeLink - Mostrar enlace al inicio
 */
export default function ErrorMessage({
	type = 'error',
	title,
	message,
	details,
	onRetry,
	showHomeLink = false,
}) {
	const config = {
		error: {
			icon: 'bi-exclamation-triangle',
			iconColor: 'text-danger',
			defaultTitle: 'Error al cargar',
			defaultMessage: 'No se pudo completar la operación.',
		},
		warning: {
			icon: 'bi-exclamation-circle',
			iconColor: 'text-warning',
			defaultTitle: 'Advertencia',
			defaultMessage: 'Algo no funcionó como se esperaba.',
		},
		info: {
			icon: 'bi-info-circle',
			iconColor: 'text-info',
			defaultTitle: 'Información',
			defaultMessage: 'Información importante.',
		},
		empty: {
			icon: 'bi-inbox',
			iconColor: 'text-muted',
			defaultTitle: 'Sin contenido',
			defaultMessage: 'No hay elementos para mostrar.',
		},
		offline: {
			icon: 'bi-wifi-off',
			iconColor: 'text-secondary',
			defaultTitle: 'Sin conexión',
			defaultMessage: 'Parece que no tienes conexión a internet.',
		},
		server: {
			icon: 'bi-server',
			iconColor: 'text-danger',
			defaultTitle: 'Error del servidor',
			defaultMessage: 'El servidor no está disponible en este momento.',
		},
	};

	const { icon, iconColor, defaultTitle, defaultMessage } = config[type] || config.error;

	return (
		<div className="d-flex flex-column align-items-center justify-content-center py-5">
			<div className="text-center">
				{/* Icono */}
				<i className={`bi ${icon} ${iconColor}`} style={{ fontSize: '4rem' }}></i>
				
				{/* Título */}
				<h3 className="h5 text-dark mt-3 mb-2">
					{title || defaultTitle}
				</h3>
				
				{/* Mensaje */}
				<p className="text-muted mb-3" style={{ maxWidth: '400px' }}>
					{message || defaultMessage}
				</p>
				
				{/* Detalles técnicos (solo desarrollo) */}
				{process.env.NODE_ENV === 'development' && details && (
					<div className="alert alert-secondary py-2 px-3 mx-auto mb-3" style={{ maxWidth: '400px' }}>
						<small className="font-monospace text-break">{details}</small>
					</div>
				)}
				
				{/* Botones */}
				<div className="d-flex gap-2 justify-content-center flex-wrap">
					{onRetry && (
						<button onClick={onRetry} className="btn btn-primary btn-sm px-3">
							<i className="bi bi-arrow-clockwise me-1"></i>
							Reintentar
						</button>
					)}
					{showHomeLink && (
						<a href="/" className="btn btn-outline-secondary btn-sm px-3">
							<i className="bi bi-house-door me-1"></i>
							Ir al inicio
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

