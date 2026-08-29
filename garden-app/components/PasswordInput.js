'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';

export default function PasswordInput({ id, disabled, ...props }) {
	const [visible, setVisible] = useState(false);
	const t = useTranslations('auth');
	const label = visible ? t('hidePassword') : t('showPassword');

	return (
		<div className="password-input">
			<input
				{...props}
				id={id}
				type={visible ? 'text' : 'password'}
				className="form-input"
				disabled={disabled}
			/>
			<button
				type="button"
				className="password-input__toggle"
				onClick={() => setVisible((v) => !v)}
				aria-label={label}
				aria-pressed={visible}
				title={label}
				disabled={disabled}
			>
				<Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
			</button>
		</div>
	);
}
