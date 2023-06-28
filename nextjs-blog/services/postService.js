import axios from "axios";

const API_URL = "http://localhost:3001/posts/";

export default class PostService {
	async getAllPosts() {
		try {
			const response = await axios.get(API_URL);
			return response.data;
		} catch (error) {
			console.error(error);
			throw new Error("Error al obtener todos los posts");
		}
	}

	async createPost(data) {
		const author = "Silvia Pescador";
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", data.content);
		formData.append("image", data.image);
		formData.append("author", author);

		try {
			const response = await axios.post(`${API_URL}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (error) {
			console.error(error);
			throw new Error("Error al crear post");
		}
	}

	async deletePost(id) {
		try {
			const response = await axios.delete(`${API_URL}${id}`);
			return response.data;
		} catch (error) {
			console.error(error);
			throw new Error("Error al eliminar post");
		}
	}
}
