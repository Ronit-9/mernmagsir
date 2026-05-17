import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import RootLayout from "./components/RootLayout.jsx"
import Login from "./features/auth/Login.jsx"
import Register from "./features/auth/Register.jsx"
import ProfilePage from "./features/user/ProfilePage.jsx"
import FeedPage from "./features/posts/FeedPage.jsx"
import EditProfilePage from "./features/user/EditProfilePage.jsx"
import SearchPage from "./features/search/SearchPage.jsx"
function RequireAuth({ children }) {
  const token = useSelector((s) => s.user.token)
  return token ? children : <Navigate to="/login" replace />
}

function RedirectIfAuth({ children }) {
  const token = useSelector((s) => s.user.token)
  return token ? <Navigate to="/" replace /> : children
}

export default function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <RequireAuth>
              <FeedPage />
            </RequireAuth>
          )
        },
        {
          path: 'login',
          element: (
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          )
        },
        {
          path: 'register',
          element: (
            <RedirectIfAuth>
              <Register />
            </RedirectIfAuth>
          )
        },
        {
          path: 'profile/:id',
          element: (
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          )
        },
        {
          path: 'profile/:id/edit',
          element: <RequireAuth><EditProfilePage /></RequireAuth>
        },
        {
          path: 'search',
          element: <RequireAuth><SearchPage /></RequireAuth>
        },
      ]
    }
  ])

  return <RouterProvider router={router} />
}