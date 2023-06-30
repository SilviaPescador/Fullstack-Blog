import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'

import PostService from "../services/postService";
import ImageUploader from "./imageUploader";
import Swal from 'sweetalert2'

export default function NewPostCard() {
	const [selectedImage, setSelectedImage] = useState(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const router = useRouter()

	const handleImageUpload = (image) => {
		setSelectedImage(image);
	};

	const onSubmit = async (data) => {
		data.image = selectedImage;
		try {
			const postService = new PostService();
			const response = await postService.createPost(data);
			alert("Yeah!! new post");
			router.push(`/posts/${response.insertId}`)
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong!: ${error}`,
			    })
			reset();
		}
	};

	return (
		<>
			<div className="container">
				<h1>Create new Post</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="w-100">
					<div className="mb-3">
						<input
							name="title"
							{...register("title")}
							className="form-control"
							placeholder="Title"
						></input>
						{errors.title && (
							<div className="alert alert-danger">{errors.title.message}</div>
						)}

						<textarea
							name="consulta"
							{...register("content")}
							className="form-control"
							placeholder="Share your thoughts..."
							rows="3"
						/>
						{errors.content && (
							<div className="alert alert-danger">{errors.content.message}</div>
						)}
					</div>
					<ImageUploader onImageUpload={handleImageUpload} />
					<div className="d-flex justify-content-end">
						<button type="submit" className="btn btn-dark sombra mx-1 mt-1">
							Post
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
