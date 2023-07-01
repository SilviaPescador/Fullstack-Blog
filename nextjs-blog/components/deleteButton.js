import { useRouter } from "next/router";

import Swal from "sweetalert2";
import PostService from "../services/postService";

export default function DeleteButton({ id, home, onDelete }) {
      const router = useRouter() 

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
				home ? onDelete() : router.push("/");
				Swal.fire("Success", response.message, "success");
			} else {
				Swal.fire("Cancelled", "The deletion was cancelled", "info");
			}
		} catch (error) {
			Swal.fire("Error", error.message, "error");
		}
	};


	return (
		<>
			<button
				className="btn"
				title="Delete this post"
				onClick={() => handleDelete(id)}
			>
				<i className="bi bi-x-lg"></i>
			</button>
		</>
	);
}
