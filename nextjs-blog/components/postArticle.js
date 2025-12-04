'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import DeleteButton from '@/components/deleteButton';
import ImageUploader from './imageUploader';
import PostService from '@/services/postService';
import formatDate from '@/common/formatDate';
import { useAuth } from '@/hooks/useAuth';
import Swal from 'sweetalert2';

export default function PostArticle({
	postData,
	onDelete,
	fullPost,
	setIsEdited,
	home,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [truncatedContent, setTruncatedContent] = useState('');
	const [content, setContent] = useState(postData.content || '');
	const [title, setTitle] = useState(postData.title || '');
	const [selectedImage, setSelectedImage] = useState(null);

	const { canEditPost, canDeletePost, loading: authLoading } = useAuth();

	const friendlyDate = formatDate(postData.post_date);
	const { register } = useForm();

	// Verificar permisos para este post específico
	const canEdit = canEditPost(postData.author_id);
	const canDelete = canDeletePost(postData.author_id);

	useEffect(() => {
		if (postData.content.length > 50) {
			setTruncatedContent(postData.content.substring(0, 50) + '...');
		} else {
			setTruncatedContent(postData.content);
		}
	}, [postData.content]);

	const handleImageUpload = (image) => {
		setSelectedImage(image);
	};

	const handleUpdates = async (newContent, newTitle) => {
		const updates = {
			content: newContent,
			title: newTitle,
			image: selectedImage,
		};

		try {
			const postService = new PostService();
			await postService.updatePost(postData.id, updates);
			await Swal.fire({
				position: 'top-end',
				icon: 'success',
				title: 'Post Updated!',
				showConfirmButton: false,
				timer: 1500,
			});
			setIsEditing(false);
			setIsEdited(true);
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong!: ${error}`,
			});
		}
	};

	// Estilos para truncar texto en grid
	const titleStyle = !fullPost
		? {
				display: '-webkit-box',
				WebkitLineClamp: 2,
				WebkitBoxOrient: 'vertical',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				minHeight: '3rem',
		  }
		: {};

	const contentStyle = !fullPost
		? {
				display: '-webkit-box',
				WebkitLineClamp: 2,
				WebkitBoxOrient: 'vertical',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
		  }
		: {};

	return (
		<article
			className={`card rounded shadow w-100 ${fullPost ? 'mt-3 mb-4' : 'h-100 d-flex flex-column'}`}
		>
			{/** IMAGE */}
			{postData.image && !isEditing && (
				<div
					className="d-flex justify-content-center rounded overflow-hidden"
					style={!fullPost ? { height: '150px' } : {}}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={postData.image}
						className={`img-fluid ${fullPost ? 'rounded-4 p-1 border border-dark mt-3' : 'card-img-top'}`}
						style={{
							height: fullPost ? 'auto' : '150px',
							width: '100%',
							objectFit: 'cover',
							maxHeight: fullPost ? '800px' : '150px',
							maxWidth: fullPost ? '800px' : '100%',
						}}
						alt={postData.title || 'Post image'}
					/>
				</div>
			)}
			{isEditing && fullPost && (
				<div className="p-3">
					<label className="form-label fw-bold">Imagen del post:</label>
					{postData.image && (
						<div className="mb-2">
							<small className="text-muted">Imagen actual: {postData.image.split('/').pop()}</small>
						</div>
					)}
					<ImageUploader onImageUpload={handleImageUpload} />
					{selectedImage && (
						<small className="text-success mt-1 d-block">
							<i className="bi bi-check-circle me-1"></i>
							Nueva imagen seleccionada: {selectedImage.name}
						</small>
					)}
				</div>
			)}

			{/** TITLE + POST_DATE */}
			<div className="card-header bg-transparent border-0 px-3 pt-3 pb-0">
				{isEditing ? (
					<textarea
						name="title"
						{...register('title')}
						className="form-control col-9"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						rows="1"
					/>
				) : !fullPost ? (
					<Link href={`/posts/${postData.id}`}>
						<h6 className="card-title fw-bold mb-1" style={titleStyle} title={postData.title}>
							{postData.title}
						</h6>
					</Link>
				) : (
					<h2 className="card-title">{postData.title}</h2>
				)}
				<small className="text-muted">
					{friendlyDate} - {postData.author}
				</small>
			</div>

			{/** POST CONTENT */}
			<div className={`card-body px-3 py-2 ${!fullPost ? 'flex-grow-1' : ''}`}>
				{isEditing ? (
					<textarea
						name="content"
						{...register('content')}
						className="form-control"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows="10"
					/>
				) : (
					<pre className="mb-0 small" style={contentStyle}>
						{fullPost ? postData.content : truncatedContent}
					</pre>
				)}
			</div>

			{/** FOOTER - BUTTONS */}
			<div className="card-footer bg-gray-100 border-0 d-flex justify-content-end py-2 mt-auto">
				{isEditing && (
					<>
						<button
							className="btn"
							title="Save changes"
							onClick={() => handleUpdates(content, title)}
						>
							<i className="bi bi-save"></i>
						</button>
						<button
							className="btn"
							title="Cancel editing"
							onClick={() => setIsEditing(false)}
						>
							<i className="bi bi-x-circle-fill"></i>
						</button>
					</>
				)}

				{/* Solo mostrar botón de editar si tiene permisos */}
				{fullPost && !isEditing && canEdit && !authLoading && (
					<button
						className="btn"
						title="Edit this post"
						onClick={() => setIsEditing(true)}
					>
						<i className="bi bi-pencil-square"></i>
					</button>
				)}

				{/* Solo mostrar botón de eliminar si tiene permisos */}
				{canDelete && !authLoading && (
					<DeleteButton id={postData.id} home={home} onDelete={onDelete} />
				)}
			</div>
		</article>
	);
}
