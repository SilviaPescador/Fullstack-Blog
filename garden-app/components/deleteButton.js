'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PostService from '@/services/postService';
import Icon from '@/components/Icons';
import { useToast } from '@/components/ToastProvider';

export default function DeleteButton({ id, home, onDelete }) {
	const router = useRouter();
	const t = useTranslations('posts.delete');
	const { showToast, showConfirm } = useToast();

	const handleDelete = async (id) => {
		const confirmed = await showConfirm({
			title: t('title'),
			message: t('message'),
			confirmText: t('confirm'),
			cancelText: t('cancel'),
			variant: 'danger',
		});

		if (!confirmed) return;

		try {
			const postService = new PostService();
			await postService.deletePost(id);
			showToast('success', t('success'));
			home ? onDelete() : router.push('/');
		} catch (error) {
			showToast('error', error.message || 'Error al eliminar');
		}
	};

	return (
		<button className="btn btn--ghost btn--icon" title={t('button')} onClick={() => handleDelete(id)}>
			<Icon name="trash" size={18} />
		</button>
	);
}
