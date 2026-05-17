import { mainApi } from "../app/mainApi.js";

const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/users/:id → { user, posts }
    getUserProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // PUT /api/users/:id → updated user object (multipart/form-data)
    updateProfile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // POST /api/users/:id/follow → { msg, following: true/false }
    followUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // GET /api/users/search?q= → [{ _id, username, profilePicture, bio }]
    // No auth required — public endpoint
    // Only fires when q has a value (skip: !q in the component)
    searchUsers: builder.query({
      query: (q) => `/users/search?q=${encodeURIComponent(q)}`,
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useFollowUserMutation,
  useSearchUsersQuery,
} = userApi;