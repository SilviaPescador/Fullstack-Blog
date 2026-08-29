'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import Icon from '@/components/Icons';

const ToastContext = createContext(null);

function ToastList({ toasts, onRemove }) {
	return (
		<div aria-live="polite" aria-atomic="false" style={{
			position: 'fixed',
			top: 'calc(var(--nav-height) + var(--space-sm))',
			right: 'var(--space-md)',
			zIndex: 9999,
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--space-xs)',
			pointerEvents: 'none',
		}}>
			{toasts.map(t => (
				<div
					key={t.id}
					role="alert"
					className={`toast toast--${t.type}`}
					style={{ pointerEvents: 'auto' }}
					onClick={() => onRemove(t.id)}
				>
					<Icon
						name={t.type === 'success' ? 'check' : t.type === 'error' ? 'alertTriangle' : 'info'}
						size={16}
					/>
					<span>{t.message}</span>
				</div>
			))}
		</div>
	);
}

function ConfirmDialogEl({ dialog, onConfirm, onCancel }) {
	if (!dialog) return null;
	const isDanger = dialog.variant === 'danger';
	const iconName = dialog.icon || (isDanger ? 'alertTriangle' : 'info');
	return (
		<div className="confirm-overlay" onClick={onCancel}>
			<div
				className={`confirm-dialog${isDanger ? ' confirm-dialog--danger' : ''}`}
				role={isDanger ? 'alertdialog' : 'dialog'}
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-message"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="confirm-dialog__body">
					<span className={`confirm-dialog__icon${isDanger ? ' confirm-dialog__icon--danger' : ''}`}>
						<Icon name={iconName} size={28} />
					</span>
					<h3 id="confirm-dialog-title">{dialog.title}</h3>
					<p id="confirm-dialog-message" className="text-muted text-sm">{dialog.message}</p>
				</div>
				<div className="confirm-dialog__actions">
					<button type="button" className="btn btn--outline" onClick={onCancel} autoFocus={isDanger}>
						{dialog.cancelText || 'Cancelar'}
					</button>
					<button
						type="button"
						className={isDanger ? 'btn btn--danger' : 'btn btn--primary'}
						onClick={onConfirm}
						autoFocus={!isDanger}
					>
						{dialog.confirmText || 'Confirmar'}
					</button>
				</div>
			</div>
		</div>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx;
}

export default function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);
	const [dialog, setDialog] = useState(null);
	const resolveRef = useRef(null);
	const counterRef = useRef(0);

	const showToast = useCallback((type, message, duration = 3500) => {
		const id = ++counterRef.current;
		setToasts(prev => [...prev, { id, type, message }]);
		setTimeout(() => {
			setToasts(prev => prev.filter(t => t.id !== id));
		}, duration);
	}, []);

	const removeToast = useCallback((id) => {
		setToasts(prev => prev.filter(t => t.id !== id));
	}, []);

	const showConfirm = useCallback(({ title, message, confirmText, cancelText, variant, icon }) => {
		return new Promise((resolve) => {
			resolveRef.current = resolve;
			setDialog({ title, message, confirmText, cancelText, variant, icon });
		});
	}, []);

	const handleConfirm = useCallback(() => {
		setDialog(null);
		resolveRef.current?.(true);
	}, []);

	const handleCancel = useCallback(() => {
		setDialog(null);
		resolveRef.current?.(false);
	}, []);

	useEffect(() => {
		if (!dialog) return;
		const onKey = (e) => {
			if (e.key === 'Escape') handleCancel();
		};
		document.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	}, [dialog, handleCancel]);

	return (
		<ToastContext.Provider value={{ showToast, showConfirm }}>
			{children}
			<ToastList toasts={toasts} onRemove={removeToast} />
			<ConfirmDialogEl dialog={dialog} onConfirm={handleConfirm} onCancel={handleCancel} />
		</ToastContext.Provider>
	);
}
