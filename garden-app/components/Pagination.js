'use client';

import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';

export default function Pagination({ currentPage, totalPages, onPageChange, scrollToTop = true }) {
	const t = useTranslations('pagination');
	const effectiveTotalPages = Math.max(totalPages, 1);
	const isSinglePage = effectiveTotalPages <= 1;

	const handleNav = (page) => {
		onPageChange(page);
		if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const isFirst = currentPage === 1 || isSinglePage;
	const isLast = currentPage === effectiveTotalPages || isSinglePage;

	return (
		<nav aria-label={t('previous')} className="flex-between py-8 px-3">
			<button
				className={`btn btn--outline btn--sm ${isFirst ? '' : ''}`}
				onClick={() => handleNav(currentPage - 1)}
				disabled={isFirst}
				aria-label={t('previous')}
			>
				<Icon name="chevronLeft" size={16} />
				{t('previous')}
			</button>

			<span className="text-muted text-sm select-none">
				{t('page')} <strong>{currentPage}</strong> {t('of')} <strong>{effectiveTotalPages}</strong>
			</span>

			<button
				className="btn btn--outline btn--sm"
				onClick={() => handleNav(currentPage + 1)}
				disabled={isLast}
				aria-label={t('next')}
			>
				{t('next')}
				<Icon name="chevronRight" size={16} />
			</button>
		</nav>
	);
}
