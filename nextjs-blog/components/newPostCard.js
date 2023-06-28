import { useForm } from "react-hook-form";
import ImageUploader from "./imageUploader";
import PostService from "../services/postService";
import { useState } from "react";

export default function NewPostCard() {
	const [selectedImage, setSelectedImage] = useState(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const handleImageUpload = (image) => {
		setSelectedImage(image);
	};

	const onSubmit = async (data) => {
		data.image = selectedImage;
		console.log(data);
		try {
			const postService = new PostService();
			const response = await postService.createPost(data);
			console.log(response);
			alert("Yeah!! new post");
			reset();
		} catch (error) {
			console.log(error);
			alert(`ooops... error: ${error}`);
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
