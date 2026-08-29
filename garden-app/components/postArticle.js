'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import DeleteButton from '@/components/deleteButton';
import WaterButton from '@/components/WaterButton';
import ImageUploader from './imageUploader';
import RichEditor from '@/components/RichEditor';
import PostService from '@/services/postService';
import formatDate from '@/common/formatDate';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/Icons';
import { useToast } from '@/components/ToastProvider';
import sanitizeHtml from 'sanitize-html';

function plainTextToHtml(text) {
	if (!text) return '';
	if (text.trim().startsWith('<')) return text;
	return text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

function sanitize(html) {
	return sanitizeHtml(html, {
		allowedTags: ['p', 'br', 'strong', 'em', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
		allowedAttributes: { a: ['href', 'target', 'rel', 'class'] },
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
		},
	});
}

export default function PostArticle({ postData, onDelete, onWater, fullPost, setIsEdited, home }) {
	const [isEditing, setIsEditing] = useState(false);
	const [truncatedContent, setTruncatedContent] = useState('');
	const [content, setContent] = useState(postData.content || '');
	const [title, setTitle] = useState(postData.title || '');
	const [selectedImage, setSelectedImage] = useState(null);

	const { canEditPost, canDeletePost, loading: authLoading } = useAuth();
	const t = useTranslations();
	const { showToast } = useToast();

	const friendlyDate = formatDate(postData.post_date);
	const { register } = useForm();
	const canEdit = canEditPost(postData.author_id);
	const canDelete = canDeletePost(postData.author_id);

	useEffect(() => {
		const raw = postData.content || '';
		const stripped = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
		setTruncatedContent(stripped.length > 80 ? stripped.substring(0, 80) + '...' : stripped);
	}, [postData.content]);

	const handleImageUpload = (image) => setSelectedImage(image);

	const handleUpdates = async (newContent, newTitle) => {
		try {
			const postService = new PostService();
			await postService.updatePost(postData.id, { content: newContent, title: newTitle, image: selectedImage });
			showToast('success', t('posts.edit.success'));
			setIsEditing(false);
			setIsEdited(true);
		} catch (error) {
			console.error(error);
			showToast('error', `${t('posts.edit.error')}: ${error}`);
		}
	};

	const titleClamp = !fullPost ? {
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		minHeight: '2.8rem',
	} : {};

	const contentClamp = !fullPost ? {
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	} : {};

	return (
		<article className={`card ${!fullPost ? 'card--interactive' : ''}`} style={!fullPost ? { height: '100%', display: 'flex', flexDirection: 'column' } : { marginBottom: 'var(--space-lg)' }}>
			{postData.image && !isEditing && (
		<div className="overflow-hidden" style={!fullPost ? { height: '200px' } : {}}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={postData.image}
					className="card__image"
					style={{
						height: fullPost ? 'auto' : '200px',
						maxHeight: fullPost ? '500px' : '200px',
						borderRadius: fullPost ? 'var(--radius-md)' : 0,
						padding: fullPost ? 'var(--space-sm)' : 0,
					}}
					alt={postData.title || t('posts.view.postImage')}
				/>
				</div>
			)}

			{isEditing && fullPost && (
				<div className="p-3">
					<label>{t('imageUploader.postImage')}:</label>
					{postData.image && (
						<p className="text-muted text-sm mb-2">
							{t('imageUploader.currentImage')}: {postData.image.split('/').pop()}
						</p>
					)}
					<ImageUploader onImageUpload={handleImageUpload} />
					{selectedImage && (
						<p className="text-success text-sm mt-2">
							<Icon name="check" size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
							{' '}{t('imageUploader.newImageSelected')}: {selectedImage.name}
						</p>
					)}
				</div>
			)}

			<div className="card__header">
				{isEditing ? (
					<textarea
						{...register('title')}
						className="form-textarea"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						rows="1"
					/>
				) : !fullPost ? (
					<Link href={`/posts/${postData.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
						<h3 style={{ ...titleClamp, fontSize: 'var(--text-base)', fontWeight: 600 }} title={postData.title}>
							{postData.title}
						</h3>
					</Link>
				) : (
					<h2>{postData.title}</h2>
				)}
				<p className="text-muted text-sm" style={{ marginTop: 'var(--space-xs)' }}>
					{friendlyDate} - {postData.author}
				</p>
			</div>

			<div className="card__body" style={!fullPost ? { flex: 1 } : {}}>
				{isEditing ? (
					<RichEditor
						initialContent={plainTextToHtml(content)}
						onChange={setContent}
						placeholder={t('posts.edit.contentPlaceholder') || 'Escribe el contenido...'}
					/>
				) : fullPost ? (
					<div
						className="post-content"
						dangerouslySetInnerHTML={{ __html: sanitize(plainTextToHtml(postData.content || '')) }}
					/>
				) : (
					<p className="text-sm" style={{ ...contentClamp, color: 'var(--color-text-secondary)' }}>
						{truncatedContent}
					</p>
				)}
			</div>

		<div className="card__footer">
			<WaterButton
				postId={postData.id}
				count={postData.water_count || 0}
				watered={!!postData.watered_by_me}
				onWater={onWater}
			/>
			<div style={{ flex: 1 }} />
			{isEditing && (
					<>
						<button className="btn btn--ghost btn--icon" title={t('posts.edit.save')} onClick={() => handleUpdates(content, title)}>
							<Icon name="save" size={18} />
						</button>
						<button className="btn btn--ghost btn--icon" title={t('posts.edit.cancel')} onClick={() => setIsEditing(false)}>
							<Icon name="x" size={18} />
						</button>
					</>
				)}
				{fullPost && !isEditing && canEdit && !authLoading && (
					<button className="btn btn--ghost btn--icon" title={t('posts.edit.editPost')} onClick={() => setIsEditing(true)}>
						<Icon name="edit" size={18} />
					</button>
				)}
				{canDelete && !authLoading && (
					<DeleteButton id={postData.id} home={home} onDelete={onDelete} />
				)}
			</div>
		</article>
	);
}
