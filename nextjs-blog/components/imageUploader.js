'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// Constantes de validación (deben coincidir con el backend)
const ALLOWED_IMAGE_TYPES = {
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/gif': ['.gif'],
	'image/webp': ['.webp'],
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUploader = ({ onImageUpload }) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [error, setError] = useState(null);

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
		setError(null);

		// Manejar archivos rechazados
		if (rejectedFiles && rejectedFiles.length > 0) {
			const rejection = rejectedFiles[0];
			const errorCode = rejection.errors[0]?.code;
			
			if (errorCode === 'file-too-large') {
				setError('El archivo es demasiado grande. Máximo 5MB');
			} else if (errorCode === 'file-invalid-type') {
				setError('Tipo de archivo no permitido. Solo JPG, PNG, GIF, WEBP');
			} else {
				setError('Archivo no válido');
			}
			return;
		}

		// Procesar archivo aceptado
		if (acceptedFiles && acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			setSelectedImage(URL.createObjectURL(file));
			onImageUpload(file);
		}
	}, [onImageUpload]);

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
		<div className="image-uploader">
			<div 
				{...getRootProps()} 
				className={`card shadow p-4 text-center cursor-pointer ${isDragActive ? 'border-primary bg-light' : ''}`}
				style={{ cursor: 'pointer', minHeight: '120px' }}
			>
				<input {...getInputProps()} />
				
				{selectedImage ? (
					<div className="position-relative">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img 
							src={selectedImage} 
							alt="Vista previa" 
							className="img-fluid rounded"
							style={{ maxHeight: '200px', objectFit: 'contain' }}
						/>
						<button
							type="button"
							className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
							onClick={clearImage}
							title="Eliminar imagen"
						>
							<i className="bi bi-x"></i>
						</button>
					</div>
				) : (
					<div className="text-muted py-3">
						<i className="bi bi-cloud-upload fs-2 mb-2 d-block"></i>
						{isDragActive ? (
							<p className="mb-0">Suelta la imagen aquí...</p>
						) : (
							<>
								<p className="mb-1">Arrastra una imagen o haz clic para seleccionar</p>
								<small className="text-secondary">
									JPG, PNG, GIF, WEBP • Máximo 5MB
								</small>
							</>
						)}
					</div>
				)}
			</div>

			{error && (
				<div className="alert alert-danger mt-2 py-2 small" role="alert">
					<i className="bi bi-exclamation-triangle me-1"></i>
					{error}
				</div>
			)}
		</div>
	);
};

export default ImageUploader;
