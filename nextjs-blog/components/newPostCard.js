'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import PostService from '@/services/postService';
import ImageUploader from './imageUploader';
import Icon from '@/components/Icons';
import Swal from 'sweetalert2';

import utilStyles from '@/styles/utils.module.css';

export default function NewPostCard() {
	const [selectedImage, setSelectedImage] = useState(null);
	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const router = useRouter();
	const t = useTranslations('posts.create');

	const onSubmit = async (data) => {
		data.image = selectedImage;
		try {
			const postService = new PostService();
			const response = await postService.createPost(data);
			Swal.fire({ position: 'top-end', icon: 'success', title: t('success'), showConfirmButton: false, timer: 1500 });
			router.push(`/posts/${response.insertId}`);
		} catch (error) {
			console.error(error);
			Swal.fire({ icon: 'error', title: 'Error', text: `${t('error')}: ${error}` });
			reset();
		}
	};

	return (
		<div>
			<h1 className={utilStyles.headingLg}>{t('inspiration')}</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<input
						{...register('title')}
						className="form-input"
						placeholder={t('titlePlaceholder')}
					/>
					{errors.title && <div className="alert alert--danger mt-2">{errors.title.message}</div>}
				</div>

				<div className="form-group">
					<textarea
						{...register('content')}
						className="form-textarea"
						placeholder={t('contentPlaceholder')}
						rows="4"
					/>
					{errors.content && <div className="alert alert--danger mt-2">{errors.content.message}</div>}
				</div>

				<ImageUploader onImageUpload={(img) => setSelectedImage(img)} />

				<div className="flex justify-end mt-4">
					<button type="submit" className="btn btn--primary" title={t('publish')}>
						<Icon name="send" size={16} />
						{t('publish')}
					</button>
				</div>
			</form>
		</div>
	);
}
