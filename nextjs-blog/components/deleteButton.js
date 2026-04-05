'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PostService from '@/services/postService';
import Icon from '@/components/Icons';
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
				background: 'var(--color-bg-elevated)',
				color: 'var(--color-text-primary)',
			});

			if (result.isConfirmed) {
				const response = await postService.deletePost(id);
				home ? onDelete() : router.push('/');
				Swal.fire({ title: t('success'), text: response.message, icon: 'success', background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' });
			}
		} catch (error) {
			Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' });
		}
	};

	return (
		<button className="btn btn--ghost btn--icon" title={t('button')} onClick={() => handleDelete(id)}>
			<Icon name="trash" size={18} />
		</button>
	);
}
