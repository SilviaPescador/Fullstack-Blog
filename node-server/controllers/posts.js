const pool = require("../db/connection");

class PostController {
	static async getAllPosts(req, res) {
		try {
			const [posts] = await pool.query("SELECT * FROM posts");
			console.log(posts);
			res.status(200).json(posts);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}

	static async createPost(req, res) {
		try {
			const [posts] = await pool.query(
				"INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
				[req.body.title, req.body.content, req.body.author]
			);
			console.log(posts);
			res.status(200).json({ insertId: posts.insertId });
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	}

	static async updatePost(req, res) {
		const { id } = req.params;
		const postData = req.body;

		try {
			const postExists = await pool.query("SELECT * FROM posts WHERE id= ?", [
				id,
			]);

			if (postExists.length === 0) {
				return res
					.status(404)
					.json({ message: "El post no está en la base de datos" });
			}

			const updatedFields = {};

			for (const [key, value] of Object.entries(postData)) {
				if (value !== postExists[0][key] && value !== "") {
					updatedFields[key] = value;
				}
			}

			// Si no hay campos actualizados, respondemos con un mensaje
			if (Object.keys(updatedFields).length === 0) {
				return res.status(200).json({
					message: "No se han modificado campos de datos",
					user: postExists[0],
				});
			}

			await pool.query("UPDATE posts SET ? WHERE id = ?", [updatedFields, id]);

			const updatedPost = await pool.query("SELECT * FROM posts WHERE id = ?", [
				id,
			]);

			return res.status(200).json({
				message: "Post actualizado con éxito",
				updatedPost: updatedPost[0],
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error al actualizar post" });
		}
	}

      static async deletePost(req, res) {
            const { id } = req.params;

		try {
			const [result] = await pool.query(
				"SELECT * FROM posts WHERE id = ? ",
				[id]
			);

			if (result.length === 0) {
				res
					.status(404)
					.send("El post no existe o no tienes permiso para eliminarlo");
				return;
			}

			await pool.query("DELETE FROM posts WHERE id = ? ", [id]);
			res
				.status(200)
				.json({ message: "El post ha sido eliminado exitosamente" });
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
      }
}

module.exports = PostController;
