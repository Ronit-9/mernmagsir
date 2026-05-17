import express from "express";
import { createPost, getPosts, updatePost, deletePost, getPost, likePost, addComment, deleteComment } from "../controller/postController.js";
import protect from "../middleware/authMiddleware.js";
import { fileCheck, updateFileCheck } from "../middleware/fileCheck.js";

const router = express.Router();
router.route("/").get(getPosts).post(protect, fileCheck, createPost);
router.route("/:id").get(getPost).put(protect, updateFileCheck, updatePost).delete(protect, deletePost);
router.route("/:id/like").post(protect, likePost);
router.route("/:id/comments").post(protect, addComment);
router.route("/:id/comments/:commentId").delete(protect, deleteComment);
export default router;