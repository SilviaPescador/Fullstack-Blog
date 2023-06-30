const pool = require("../db/connection");
const path = require("path");
const fs = require("fs");

class PostController {
	static async getPosts(req, res) {
		try {
			const id = req.params.id;
			console.log(id);

			if (id) {
				const [post] = await pool.query(
					"SELECT * FROM posts WHERE id = ?",
					[id]
				);

				if (!post.length) {
					return res.status(404).json({ message: "Post not found" });
				}

				const postWithImageUrl = post[0].image
					? {
							...post[0],
							image: `${req.protocol}://${req.get("host")}${post[0].image}`,
					  }
					: {
							...post[0],
							image: null,
					  };

				return res.status(200).json(postWithImageUrl);
			} else {
				console.log("por aqui");
				const [posts] = await pool.query("SELECT * FROM posts ORDER BY post_date DESC");
				const postsWithImageUrl = posts.map((post) =>
					post.image
						? {
								...post,
								image: `${req.protocol}://${req.get("host")}/${post.image}`,
						  }
						: {
								...post,
								image: null,
						  }
				);

				console.log(postsWithImageUrl);
				return res.status(200).json(postsWithImageUrl);
			}
		} catch (err) {
			console.error(err);
			return res.status(500).json(err);
		}
	}

	static async createPost(req, res) {
		const { title, content, author } = req.body;
		const image = req.file;

		let imageUrl = "";

		if (image) {
			const imagePath = path.join(
				__dirname,
				"../public/images",
				image.originalname
			);
			await fs.promises.rename(image.path, imagePath);
			imageUrl = `/images/${image.originalname}` || "";
		}

		try {
			const [result] = await pool.query(
				"INSERT INTO posts (title, image, content, author) VALUES (?, ?, ?, ?)",
				[title, imageUrl, content, author]
			);

			res.status(200).json({ insertId: result.insertId });
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
			const [result] = await pool.query("SELECT * FROM posts WHERE id = ? ", [
				id,
			]);

			if (result.length === 0) {
				res
					.status(404)
					.send("El post no existe o no tienes permiso para eliminarlo");
				return;
			}

			await pool.query("DELETE FROM posts WHERE id = ? ", [id]);

			// Elimino la imagen
			const imagePath = path.join(__dirname, "../public", result[0].image);
			console.log(imagePath);
			fs.unlink(imagePath, (err) => {
				if (err) {
					console.error(err);
				}
			});

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
