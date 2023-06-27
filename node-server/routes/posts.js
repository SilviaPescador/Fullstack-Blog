const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts");

/* GET posts listing. */
router.get("/", postController.getAllPosts);
/* POST create new post */
router.post("/", postController.createPost);
/* PATCH update only changed items of post */
router.patch("/:id", postController.updatePost);
/* DELETE delete post */
router.delete("/:id", postController.deletePost);

module.exports = router;


