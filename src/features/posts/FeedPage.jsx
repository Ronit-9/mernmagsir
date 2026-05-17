import { useGetPostsQuery } from '../../services/Post.js';
import CreatePostForm from './CreatePostForm.jsx';
import PostCard from './PostCard.jsx';

export default function FeedPage() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-3 sm:px-5 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">

        <CreatePostForm />

        {isLoading && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 py-14 sm:py-16 flex items-center justify-center">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-red-100 py-12 sm:py-14 px-6 text-center">
            <p className="text-sm text-red-500 font-medium">Failed to load posts</p>
            <p className="text-xs text-gray-400 mt-1">Please try again later</p>
          </div>
        )}

        {!isLoading && !isError && posts?.length === 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 py-14 sm:py-16 px-6 text-center">
            <div className="text-4xl sm:text-5xl mb-3">📭</div>
            <h2 className="text-base sm:text-lg font-semibold text-black">No posts yet</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Be the first to share something</p>
          </div>
        )}

        {!isLoading && !isError && posts?.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

      </div>
    </div>
  );
}