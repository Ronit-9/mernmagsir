import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// export const BASE_URL = 'http://192.168.1.69:5000';
export const BASE_URL = 'https://mernmangsir.onrender.com';
export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://192.168.1.69:5000/api',
    baseUrl: 'https://mernmangsir.onrender.com/api',
    // Automatically attaches token to every request
    // Reads from Redux state → state.user.token
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Post', 'User'],
  endpoints: () => ({}),
});