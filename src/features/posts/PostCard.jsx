import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useLikePostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeletePostMutation,
} from '../../services/Post.js';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaTrash,
} from 'react-icons/fa';

function getInitials(username = '') {
  return username
    .split(/[\s_]+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
}

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.user.user);

  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deletePost] = useDeletePostMutation();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const isLiked = post.likes?.some(
    (id) => id.toString() === currentUser?.id
  );

  const isMyPost = post.author?._id === currentUser?.id;

  // ✅ Direct URL
  const authorAvatar = post.author?.profilePicture || null;

  const handleLike = async () => {
    try {
      await likePost(post._id).unwrap();
    } catch {
      toast.error('Could not like post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setCommenting(true);

    try {
      await addComment({
        postId: post._id,
        text: commentText.trim(),
      }).unwrap();

      setCommentText('');
    } catch {
      toast.error('Could not add comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({
        postId: post._id,
        commentId,
      }).unwrap();

      toast.success('Comment deleted');
    } catch {
      toast.error('Could not delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await deletePost(post._id).unwrap();
      toast.success('Post deleted');
    } catch {
      toast.error('Could not delete post');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-2">
        <button
          onClick={() => navigate(`/profile/${post.author?._id}`)}
          className="flex items-center gap-2.5 hover:opacity-80 transition"
        >
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11">
            {authorAvatar && (
              <AvatarImage
                src={authorAvatar}
                alt={post.author?.username}
              />
            )}

            <AvatarFallback className="bg-black text-white text-xs sm:text-sm font-medium">
              {getInitials(post.author?.username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-black leading-none">
              {post.author?.username}
            </span>

            <span className="text-xs text-gray-400 mt-0.5">
              {timeAgo(post.createdAt)} ago
            </span>
          </div>
        </button>

        {isMyPost && (
          <button
            onClick={handleDeletePost}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
          >
            <FaTrash className="text-xs sm:text-sm" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 py-2 sm:py-3">
        <p className="text-sm sm:text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-3 pb-3">
          <img
            src={post.image}
            alt="Post"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            className="w-full max-h-[300px] sm:max-h-[500px] object-cover rounded-xl sm:rounded-2xl border border-gray-100"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-5 py-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 sm:gap-2 text-sm font-medium transition ${isLiked
            ? 'text-red-500'
            : 'text-gray-500 hover:text-red-500'
            }`}
        >
          {isLiked ? (
            <FaHeart className="text-base sm:text-lg" />
          ) : (
            <FaRegHeart className="text-base sm:text-lg" />
          )}

          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments((p) => !p)}
          className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-500 hover:text-black transition"
        >
          <FaRegCommentDots className="text-base sm:text-lg" />

          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-4 flex flex-col gap-3">

          {/* Comment List */}
          {post.comments?.map((c) => {

            // ✅ Direct URL
            const cAvatar = c.author?.profilePicture || null;

            const isMyComment =
              c.author?._id === currentUser?.id;

            return (
              <div key={c._id} className="flex gap-2">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                  {cAvatar && (
                    <AvatarImage
                      src={cAvatar}
                      alt={c.author?.username}
                    />
                  )}

                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                    {getInitials(c.author?.username)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 bg-gray-100 rounded-xl sm:rounded-2xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-black">
                        {c.author?.username}
                      </p>

                      <p className="text-xs text-gray-400">
                        {timeAgo(c.createdAt)}
                      </p>
                    </div>

                    {isMyComment && (
                      <button
                        onClick={() =>
                          handleDeleteComment(c._id)
                        }
                        className="text-gray-400 hover:text-red-500 transition text-xs ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Add Comment */}
          <form
            onSubmit={handleAddComment}
            className="flex items-center gap-2 mt-1"
          >
            <Avatar className="h-7 w-7 sm:h-9 sm:w-9 shrink-0">
              {currentUser?.profilePicture && (
                <AvatarImage
                  src={currentUser.profilePicture}
                />
              )}

              <AvatarFallback className="bg-black text-white text-xs">
                {getInitials(currentUser?.username)}
              </AvatarFallback>
            </Avatar>

            <Input
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
              maxLength={300}
              className="flex-1 h-9 sm:h-11 rounded-full border-gray-200 bg-gray-50 text-xs sm:text-sm shadow-none focus-visible:ring-0"
            />

            <Button
              type="submit"
              disabled={!commentText.trim() || commenting}
              className="h-9 sm:h-11 px-3 sm:px-5 rounded-full bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
            >
              {commenting ? '...' : 'Send'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}