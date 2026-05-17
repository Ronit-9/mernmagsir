import Post from '../models/Post.js';
import Joi from 'joi';

import { fileDelete } from '../utils/deleteFile.js';
// Validation
const postSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  image: Joi.string().uri().optional().allow(''),
});

const commentSchema = Joi.object({
  text: Joi.string().min(1).max(300).required(),
});

// GET /api/posts — get all posts (feed, newest first)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// GET /api/posts/:id — get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');

    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// POST /api/posts — create post (auth required)
// POST /api/posts — create post (auth required)
export const createPost = async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { content } = req.body; // no author from body
  try {
    const post = await Post.create({
      content,
      image: req.imagePath || '',
      author: req.user.id   // use id from JWT payload
    });

    const populated = await post.populate('author', 'username profilePicture');
    res.status(201).json(populated);
  } catch (err) {
    if (req.imagePath) {
      await fileDelete(`./uploads/${req.imagePath}`);
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// PUT /api/posts/:id — update post (owner only)
export const updatePost = async (req, res) => {
  // Validate request body
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const { content } = req.body || {};

  try {
    // Find post by ID
    const post = await Post.findById(req.params.id);

    if (!post) {
      if (req.imagePath) {
        await fileDelete(`./uploads/${req.imagePath}`);
      }
      return res.status(404).json({ msg: "Post not found" });
    }

    // Authorization check
    if (post.author.toString() !== req.user.id) {
      if (req.imagePath) {
        await fileDelete(`./uploads/${req.imagePath}`);
      }
      return res.status(403).json({ msg: "Not authorized to edit this post" });
    }

    // Update fields with fallbacks
    post.content = content || post.content;

    // Handle image replacement
    if (req.imagePath) {
      if (post.image) {
        try {
          await fileDelete(`./uploads/${post.image}`); // delete old image
        } catch (err) {
          console.error("Failed to delete old image:", err.message);
        }
      }
      post.image = req.imagePath; // save new image
    }

    // Save changes
    await post.save();

    // Populate author info for response
    const populated = await post.populate("author", "username profilePicture");
    return res.status(200).json({ msg: "Post updated", post: populated });
  } catch (err) {
    if (req.imagePath) {
      await fileDelete(`./uploads/${req.imagePath}`);
    }
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
// DELETE /api/posts/:id — delete post (owner only)

// DELETE /api/posts/:id — delete post (owner only)



export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this post" });
    }

    if (post.image) {
      await fileDelete(post.image); // pass only filename
    }

    await post.deleteOne();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// POST /api/posts/:id/like — like or unlike a post (toggle)
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user.id },
      });
      return res.json({ msg: 'Post unliked', liked: false });
    } else {
      await Post.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: req.user.id },
      });
      return res.json({ msg: 'Post liked', liked: true });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// POST /api/posts/:id/comment — add a comment
export const addComment = async (req, res) => {
  const { error } = commentSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.comments.push({
      text: req.body.text,
      author: req.user.id,
      createdAt: new Date(),
    });

    await post.save();
    await post.populate('comments.author', 'username profilePicture');
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// DELETE /api/posts/:id/comment/:commentId — delete a comment (comment owner only)
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

