const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const postController = require("../controllers/posts");

// almacenamiento de archivos con multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../public/images"));
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

// middleware multer
const upload = multer({ storage });

/* GET posts listing. */
router.get("/:id?", postController.getPosts);
/* POST create new post */
router.post("/", upload.single("image"), postController.createPost);
/* PATCH update only changed items of post */
router.patch("/:id", postController.updatePost);
/* DELETE delete post */
router.delete("/:id", postController.deletePost);

module.exports = router;
