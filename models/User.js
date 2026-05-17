import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: 160
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following:
      [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
