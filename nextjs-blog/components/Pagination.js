'use client';

/**
 * Componente de paginación reutilizable
 * 
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {function} onPageChange - Callback cuando cambia la página
 * @param {boolean} scrollToTop - Si debe hacer scroll arriba al cambiar (default: true)
 */
export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	scrollToTop = true,
}) {
	if (totalPages <= 1) return null;

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
			if (scrollToTop) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
			if (scrollToTop) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	return (
		<nav aria-label="Navegación de páginas" className="my-5">
			<div className="d-flex justify-content-between align-items-center px-2 py-3">
				<button
					type="button"
					className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
						isFirstPage ? 'btn-outline-secondary disabled' : 'btn-outline-primary'
					}`}
					onClick={handlePrevious}
					disabled={isFirstPage}
					aria-label="Página anterior"
				>
					<i className="bi bi-chevron-left"></i>
					<span>Anterior</span>
				</button>

				<span className="text-muted user-select-none">
					Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
				</span>

				<button
					type="button"
					className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
						isLastPage ? 'btn-outline-secondary disabled' : 'btn-outline-primary'
					}`}
					onClick={handleNext}
					disabled={isLastPage}
					aria-label="Página siguiente"
				>
					<span>Siguiente</span>
					<i className="bi bi-chevron-right"></i>
				</button>
			</div>
		</nav>
	);
}

