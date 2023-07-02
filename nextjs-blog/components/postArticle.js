import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import Link from "next/link";

import DeleteButton from "../components/deleteButton";
import ImageUploader from "./imageUploader";
import PostService from "../services/postService";
import formatDate from "../common/formatDate";
import Swal from "sweetalert2";

export default function PostArticle({
	postData,
	onDelete,
	fullPost,
	setIsEdited,
	home,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [truncatedContent, setTruncatedContent] = useState("");
	const [content, setContent] = useState(postData.content || "");
	const [title, setTitle] = useState(postData.title || "");
	const [selectedImage, setSelectedImage] = useState(null);

	const friendlyDate = formatDate(postData.post_date);
	const { register } = useForm();

	useEffect(() => {
		if (postData.content.length > 50) {
			setTruncatedContent(postData.content.substring(0, 50) + "...");
		} else {
			setTruncatedContent(postData.content);
		}
	}, []);

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
				position: "top-end",
				icon: "success",
				title: "Post Updated!",
				showConfirmButton: false,
				timer: 1500,
			});
			setIsEditing(false);
			setIsEdited(true);
		} catch (error) {
			console.log(error);
			alert(`Oops... error: ${error}`);
		}
	};

	return (
		<article className="card rounded mt-3  mb-4 shadow ">
			{/** IMAGE (if not null) */}
			{postData.image && (
				<>
					<div className="d-flex justify-content-center rounded">
						<Image
							priority
							src={postData.image}
							className="img-fluid rounded-4 p-1 border border-dark mt-3"
							height={fullPost ? 800 : 200}
							width={fullPost ? 800 : 200}
							alt=""
						/>
					</div>
					{isEditing && <ImageUploader onImageUpload={handleImageUpload} />}
				</>
			)}
			{/** TITLE + POST_DATE */}
			<div className=" mx-3 align-items-center p-2">
				{isEditing ? (
					<textarea
						name="title"
						{...register("title")}
						className="form-control col-9"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						rows="1"
					/>
				) : !fullPost ? (
					<Link href="/posts/[id]" as={`/posts/${postData.id}`}>
						<h2 className="card-title">{postData.title}</h2>
					</Link>
				) : (
					<h2 className="card-title">{postData.title}</h2>
				)}
				<p>
					{friendlyDate} - {postData.author}
				</p>
			</div>
			{/** POST CONTENT */}
			<div className="card-body mx-3">
				{isEditing ? (
					<textarea
						name="content"
						{...register("content")}
						className="form-control"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows="10"
					/>
				) : (
					<pre>{fullPost ? postData.content : truncatedContent}</pre>
				)}
			</div>
			{/** FOOTER - BUTTONS */}
			<div className="card-footer d-flex justify-content-end">
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

				{fullPost && !isEditing && (
					<button
						className="btn"
						title="Edit this post"
						onClick={() => setIsEditing(true)}
					>
						<i className="bi bi-pencil-square"></i>
					</button>
				)}
				<DeleteButton id={postData.id} home={home} onDelete={onDelete} />
			</div>
		</article>
	);
}
