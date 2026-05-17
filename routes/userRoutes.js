import express from "express";
import { getUserProfile, updateProfile, followUser, getSearchUsers } from "../controller/userController.js";
import protect from "../middleware/authMiddleware.js";

import { profilePictureCheck } from "../middleware/profilePictureCheck.js";

const router = express.Router();
router.get('/search', getSearchUsers);

router.route("/:id").get(getUserProfile).put(protect, profilePictureCheck, updateProfile);
router.route("/:id/follow").post(protect, followUser);

export default router;