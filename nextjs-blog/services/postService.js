import axios from "axios";

const API_URL = "http://localhost:3001/posts/";

export default class PostService {
	async getPosts(id = null) {
		try {
			const url = id ? `${API_URL}${id}` : API_URL;
			const response = await axios.get(url);
			return response.data;
		} catch (error) {
			console.error(error);
			throw new Error("Error al obtener los posts");
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

	async updatePost(id, data) {
		console.log(id, data);
		// const formData = new FormData();
		// formData.append("title", data.title);
		// formData.append("content", data.content);
		// formData.append("image", data.image);
		// console.log(formData)
		try {
			const response = await axios.patch(`${API_URL}${id}`, data , {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (error) {
			throw new Error("Error al actualizar el post");
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
