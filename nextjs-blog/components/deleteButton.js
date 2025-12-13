'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import PostService from '@/services/postService';
import Swal from 'sweetalert2';

export default function DeleteButton({ id, home, onDelete }) {
	const router = useRouter();
	const t = useTranslations('posts.delete');

	const handleDelete = async (id) => {
		try {
			const postService = new PostService();
			const result = await Swal.fire({
				title: t('title'),
				text: t('message'),
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: t('confirm'),
				cancelButtonText: t('cancel'),
				customClass: {
					confirmButton: 'btn btn-danger',
					cancelButton: 'btn btn-secondary',
				},
			});

			if (result.isConfirmed) {
				const response = await postService.deletePost(id);
				home ? onDelete() : router.push('/');
				Swal.fire(t('success'), response.message, 'success');
			} else {
				Swal.fire(t('cancelled'), t('cancelledMessage'), 'info');
			}
		} catch (error) {
			Swal.fire('Error', error.message, 'error');
		}
	};

	return (
		<button
			className="btn"
			title={t('button')}
			onClick={() => handleDelete(id)}
		>
			<i className="bi bi-x-lg fs-5"></i>
		</button>
	);
}
