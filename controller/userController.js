import User from '../models/User.js';
import path from 'path';
import Post from '../models/Post.js';
import { removeFile } from '../utils/removeFile.js';
import Joi from 'joi';
// Validation
const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  bio: Joi.string().max(160).optional().allow(''),
  profilePicture: Joi.string().uri().optional().allow(''),
});

// GET /api/users/search?q=username — search users
export const getSearchUsers = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ msg: 'Search query is required' });

  try {
    const users = await User.find({
      username: { $regex: q, $options: 'i' },
    }).select('username profilePicture bio').limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// GET /api/users/:id — get user profile + their posts
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/// PUT /api/users/:id — update profile (owner only)
export const updateProfile = async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  if (req.params.id !== req.user.id) {
    return res.status(403).json({ msg: "Not authorized to update this profile" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Username uniqueness check
    if (req.body.username) {
      const existing = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.user.id },
      });
      if (existing) return res.status(400).json({ msg: "Username already taken" });
    }

    // Update text fields
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;

    // Handle profile picture replacement
    if (req.imagePath) {
      if (user.profilePicture) {
        // Always store only the filename in DB
        const oldPath = path.resolve("profileuploads", user.profilePicture);
        await removeFile(oldPath);
      }
      user.profilePicture = req.imagePath;
    }
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (err) {
    if (req.imagePath) {
      await removeFile(path.join("./profileuploads", req.imagePath));
    }
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
// POST /api/users/:id/follow — follow or unfollow (toggle)
export const followUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ msg: 'You cannot follow yourself' });
  }

  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ msg: 'User not found' });

    const currentUser = await User.findById(req.user.id);
    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user.id },
      });
      return res.json({ msg: 'Unfollowed successfully', following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: req.user.id },
      });
      return res.json({ msg: 'Followed successfully', following: true });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

