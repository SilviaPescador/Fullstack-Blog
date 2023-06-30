import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import formatDate from "../common/formatDate";
import PostService from "../services/postService";
import Swal from "sweetalert2";

export default function PostArticle({
	postData,
	onDelete,
	fullPost,
	setIsEdited,
	home
}) {
	const [truncatedContent, setTruncatedContent] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(postData.content || "");
	const [title, setTitle] = useState(postData.title || "");
	const friendlyDate = formatDate(postData.post_date);
	const {
		register,
	} = useForm();
	const router = useRouter()

	useEffect(() => {
		if (postData.content.length > 50) {
			setTruncatedContent(postData.content.substring(0, 50) + "...");
		} else {
			setTruncatedContent(postData.content);
		}
	}, []);

	const onSubmit = async (newContent, newTitle) => {
		const data = {
			content: newContent,
			title: newTitle,
		};
		console.log(data);
		try {
			const postService = new PostService();
			const response = await postService.updatePost(postData.id, data);
			alert(response);
			alert("Post updated successfully");
			setIsEditing(false);
			setIsEdited(true);
		} catch (error) {
			console.log(error);
			alert(`Oops... error: ${error}`);
		}
	};
	const handleDelete = async (id) => {
		try {
			const postService = new PostService();
			const result = await Swal.fire({
				title: "Confirm Deletion",
				text: "Are you sure you want to delete this post?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Delete",
				cancelButtonText: "Cancel",
				customClass: {
					confirmButton: "btn btn-danger",
					cancelButton: "btn btn-secondary",
				},
			});

			if (result.isConfirmed) {
				const response = await postService.deletePost(id);
				home ? onDelete() : router.push('/')
				Swal.fire("Success", response.message, "success");
			} else {
				Swal.fire("Cancelled", "The deletion was cancelled", "info");
			}
		} catch (error) {
			Swal.fire("Error", error.message, "error");
		}
	};

	return (
		<article className="card rounded mt-3 mx-3 shadow">
			{/** IMAGE (if not null) */}
			{postData.image && (
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
						rows="3"
					/>
				) : (
					<Link href="/posts/[id]" as={`/posts/${postData.id}`}>
						<h2 className="card-title">{postData.title}</h2>
					</Link>
				)}
				<p>{friendlyDate} - {postData.author}</p>
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
					<pre className="">{fullPost ? postData.content : truncatedContent}</pre>
				)}
			</div>
			{/** FOOTER - BUTTONS */}
			<div className="card-footer d-flex justify-content-end">
				{isEditing && (
					<>
						<button
							className="btn"
							title="Save changes"
							onClick={() => onSubmit(content, title)}
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
				<button
					className="btn"
					title="Delete this post"
					onClick={() => handleDelete(postData.id)}
				>
					<i className="bi bi-x-lg"></i>
				</button>
			</div>
		</article>
	);
}
