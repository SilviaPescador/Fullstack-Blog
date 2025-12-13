'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import utilStyles from '@/styles/utils.module.css';

import PostService from '@/services/postService';
import ImageUploader from './imageUploader';
import Swal from 'sweetalert2';

export default function NewPostCard() {
	const [selectedImage, setSelectedImage] = useState(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const router = useRouter();
	const t = useTranslations('posts.create');

	const handleImageUpload = (image) => {
		setSelectedImage(image);
	};

	const onSubmit = async (data) => {
		data.image = selectedImage;
		try {
			const postService = new PostService();
			const response = await postService.createPost(data);
			Swal.fire({
				position: 'top-end',
				icon: 'success',
				title: t('success'),
				showConfirmButton: false,
				timer: 1500,
			});
			router.push(`/posts/${response.insertId}`);
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: '¡Vaya!',
				text: `${t('error')}: ${error}`,
			});
			reset();
		}
	};

	return (
		<>
			<div className="container">
				<h1 className={utilStyles.headingLg}>{t('inspiration')}</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="w-100">
					<div className="mb-3">
						<input
							name="title"
							{...register('title')}
							className="form-control shadow mb-1"
							placeholder={t('titlePlaceholder')}
						></input>
						{errors.title && (
							<div className="alert alert-danger">{errors.title.message}</div>
						)}

						<textarea
							name="consulta"
							{...register('content')}
							className="form-control shadow"
							placeholder={t('contentPlaceholder')}
							rows="3"
						/>
						{errors.content && (
							<div className="alert alert-danger">{errors.content.message}</div>
						)}
					</div>
					<ImageUploader onImageUpload={handleImageUpload} />
					<div className="d-flex justify-content-end">
						<button type="submit" className="btn mx-1 mt-2" title={t('publish')}>
							<i className="bi bi-send fs-3"></i>
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
