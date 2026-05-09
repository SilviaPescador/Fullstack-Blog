'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import Icon from '@/components/Icons';

const ALLOWED_IMAGE_TYPES = {
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/gif': ['.gif'],
	'image/webp': ['.webp'],
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({ onImageUpload }) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [error, setError] = useState(null);
	const t = useTranslations('imageUploader');

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
		setError(null);
		if (rejectedFiles?.length > 0) {
			const code = rejectedFiles[0].errors[0]?.code;
			setError(code === 'file-too-large' ? t('errors.tooLarge') : code === 'file-invalid-type' ? t('errors.invalidType') : t('errors.invalid'));
			return;
		}
		if (acceptedFiles?.length > 0) {
			const file = acceptedFiles[0];
			setSelectedImage(URL.createObjectURL(file));
			onImageUpload(file);
		}
	}, [onImageUpload, t]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: ALLOWED_IMAGE_TYPES,
		maxSize: MAX_FILE_SIZE,
		maxFiles: 1,
		multiple: false,
	});

	const clearImage = (e) => {
		e.stopPropagation();
		setSelectedImage(null);
		setError(null);
		onImageUpload(null);
	};

	return (
		<div>
			<div
				{...getRootProps()}
				className="card cursor-pointer text-center"
				style={{
					padding: 'var(--space-lg)',
					borderStyle: 'dashed',
					borderColor: isDragActive ? 'var(--color-accent-green)' : 'var(--color-border)',
					background: isDragActive ? 'var(--color-accent-green-soft)' : 'var(--color-bg-alt)',
				}}
			>
				<input {...getInputProps()} />
				{selectedImage ? (
					<div className="relative">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={selectedImage} alt={t('preview')} className="rounded" style={{ maxHeight: '200px', objectFit: 'contain', margin: '0 auto' }} />
						<button
							type="button"
							className="btn btn--danger btn--sm absolute"
							style={{ top: '0.5rem', right: '0.5rem' }}
							onClick={clearImage}
							title={t('remove')}
						>
							<Icon name="x" size={14} />
						</button>
					</div>
				) : (
					<div className="text-muted" style={{ padding: 'var(--space-md) 0' }}>
						<Icon name="upload" size={32} style={{ margin: '0 auto 0.5rem' }} />
						{isDragActive ? (
							<p>{t('dropHere')}</p>
						) : (
							<>
								<p>{t('dropzone')}</p>
								<p className="text-xs text-muted mt-2">{t('formats')}</p>
							</>
						)}
					</div>
				)}
			</div>
			{error && (
				<div className="alert alert--danger mt-2">
					<Icon name="alertTriangle" size={14} /> {error}
				</div>
			)}
		</div>
	);
};

export default ImageUploader;
