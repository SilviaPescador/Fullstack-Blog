// Servicio para interactuar con la API de posts
// Ahora usa las API Routes internas de Next.js en lugar del servidor Express externo

const API_URL = '/api/posts';

export default class PostService {
	async getPosts(id = null) {
		try {
			const url = id ? `${API_URL}/${id}` : API_URL;
			const response = await fetch(url);
			
			if (!response.ok) {
				throw new Error('Error al obtener los posts');
			}
			
			return response.json();
		} catch (error) {
			console.error(error);
			throw new Error('Error al obtener los posts');
		}
	}

	async createPost(data) {
		const author = 'Silvia Pescador';
		const formData = new FormData();
		formData.append('title', data.title);
		formData.append('content', data.content);
		formData.append('author', author);
		
		if (data.image) {
			formData.append('image', data.image);
		}

		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Error al crear post');
			}

			return response.json();
		} catch (error) {
			console.error(error);
			throw new Error('Error al crear post');
		}
	}

	async updatePost(id, data) {
		const formData = new FormData();
		
		if (data.title) {
			formData.append('title', data.title);
		}
		if (data.content) {
			formData.append('content', data.content);
		}
		if (data.image) {
			formData.append('image', data.image);
		}

		try {
			const response = await fetch(`${API_URL}/${id}`, {
				method: 'PATCH',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Error al actualizar el post');
			}

			return response.json();
		} catch (error) {
			console.error(error);
			throw new Error('Error al actualizar el post');
		}
	}

	async deletePost(id) {
		try {
			const response = await fetch(`${API_URL}/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Error al eliminar post');
			}

			return response.json();
		} catch (error) {
			console.error(error);
			throw new Error('Error al eliminar post');
		}
	}
}
