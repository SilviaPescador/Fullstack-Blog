'use client';

import { useTranslations } from 'next-intl';

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
	const t = useTranslations('pagination');
	
	// Siempre mostrar el componente, con botones disabled si solo hay 1 página
	const effectiveTotalPages = Math.max(totalPages, 1);
	const isSinglePage = effectiveTotalPages <= 1;

	const handlePrevious = () => {
		if (currentPage > 1 && !isSinglePage) {
			onPageChange(currentPage - 1);
			if (scrollToTop) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	const handleNext = () => {
		if (currentPage < effectiveTotalPages && !isSinglePage) {
			onPageChange(currentPage + 1);
			if (scrollToTop) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	const isFirstPage = currentPage === 1 || isSinglePage;
	const isLastPage = currentPage === effectiveTotalPages || isSinglePage;

	return (
		<nav aria-label={t('previous')} className="my-5">
			<div className="d-flex justify-content-between align-items-center px-2 py-3">
				<button
					type="button"
					className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
						isFirstPage ? 'btn-outline-secondary disabled' : 'btn-outline-primary'
					}`}
					onClick={handlePrevious}
					disabled={isFirstPage}
					aria-label={t('previous')}
				>
					<i className="bi bi-chevron-left"></i>
					<span>{t('previous')}</span>
				</button>

				<span className="text-muted user-select-none">
					{t('page')} <strong>{currentPage}</strong> {t('of')} <strong>{effectiveTotalPages}</strong>
				</span>

				<button
					type="button"
					className={`btn d-flex align-items-center gap-2 px-3 py-2 ${
						isLastPage ? 'btn-outline-secondary disabled' : 'btn-outline-primary'
					}`}
					onClick={handleNext}
					disabled={isLastPage}
					aria-label={t('next')}
				>
					<span>{t('next')}</span>
					<i className="bi bi-chevron-right"></i>
				</button>
			</div>
		</nav>
	);
}
