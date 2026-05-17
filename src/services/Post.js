import { mainApi } from "../app/mainApi.js";
const postApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/posts — public, newest first
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),

    // POST /api/posts — auth + multipart/form-data
    // image key is REQUIRED by fileCheck.js middleware
    createPost: builder.mutation({
      query: (formData) => ({
        url: '/posts',
        method: 'POST',
        body: formData, // FormData with 'content' + 'image'
      }),
      invalidatesTags: ['Post'],
    }),

    // DELETE /api/posts/:id — owner only
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),

    // POST /api/posts/:id/like — toggle like
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),

    // POST /api/posts/:id/comments — { text }
    addComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Post'],
    }),

    // DELETE /api/posts/:id/comments/:commentId
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = postApi;