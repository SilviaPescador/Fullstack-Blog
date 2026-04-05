'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
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
						name={t.type === 'success' ? 'check' : t.type === 'error' ? 'alert-triangle' : 'info'}
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
	return (
		<>
			<div className="confirm-backdrop" onClick={onCancel} />
			<dialog className="confirm-dialog" open aria-modal="true">
				<div className="confirm-dialog__body">
					<Icon name="alert-triangle" size={32} style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-sm)' }} />
					<h3 style={{ marginBottom: 'var(--space-xs)' }}>{dialog.title}</h3>
					<p className="text-muted text-sm">{dialog.message}</p>
				</div>
				<div className="confirm-dialog__actions">
					<button className="btn btn--outline" onClick={onCancel}>{dialog.cancelText || 'Cancelar'}</button>
					<button className="btn btn--danger" onClick={onConfirm}>{dialog.confirmText || 'Confirmar'}</button>
				</div>
			</dialog>
		</>
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

	const showConfirm = useCallback(({ title, message, confirmText, cancelText }) => {
		return new Promise((resolve) => {
			resolveRef.current = resolve;
			setDialog({ title, message, confirmText, cancelText });
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

	return (
		<ToastContext.Provider value={{ showToast, showConfirm }}>
			{children}
			<ToastList toasts={toasts} onRemove={removeToast} />
			<ConfirmDialogEl dialog={dialog} onConfirm={handleConfirm} onCancel={handleCancel} />
		</ToastContext.Provider>
	);
}
