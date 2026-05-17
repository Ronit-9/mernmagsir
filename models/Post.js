
import mongoose from 'mongoose';



const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 300
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    image: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
