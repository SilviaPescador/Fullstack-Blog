'use client';

import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';

export default function PostSearch({ value, onChange }) {
	const t = useTranslations('posts.search');

	return (
		<div className="post-search">
			<label htmlFor="post-search" className="sr-only">{t('label')}</label>
			<Icon name="search" size={15} className="post-search__icon" />
			<input
				id="post-search"
				type="search"
				className="post-search__input"
				placeholder={t('placeholder')}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				autoComplete="off"
				spellCheck="false"
			/>
			{value && (
				<button
					type="button"
					className="post-search__clear"
					onClick={() => onChange('')}
					aria-label={t('clear')}
				>
					<Icon name="x" size={14} />
				</button>
			)}
		</div>
	);
}
