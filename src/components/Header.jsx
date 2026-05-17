import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DropDownMenu from './DropDownMenu.jsx';

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/90 backdrop-blur-md
        border-b border-gray-100
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          px-5 py-3
          flex items-center justify-between
        "
      >

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div
            className="
    w-10 h-10 rounded-2xl
    bg-blue-400 hover:bg-blue-500
    text-white
    flex items-center justify-center
    font-semibold text-lg
    shadow-sm
    transition
  "
          >
            S
          </div>

          <div className="leading-none">
            <h1 className="text-lg font-semibold text-black">
              Socially
            </h1>

            <p className="text-xs text-gray-400 mt-1">
              Share moments
            </p>
          </div>
        </NavLink>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center gap-3">

            {/* Search */}
            <button
              onClick={() => navigate('/search')}
              title="Search users"
              className="
                w-10 h-10 rounded-xl
                flex items-center justify-center
                hover:bg-gray-100
                transition-all duration-200
              "
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                />
              </svg>
            </button>

            {/* Notifications */}
            <button
              className="
                relative
                w-10 h-10 rounded-xl
                flex items-center justify-center
                hover:bg-gray-100
                transition-all duration-200
              "
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
                  14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0
                  10-4 0v.341C7.67 6.165 6 8.388 6
                  11v3.159c0 .538-.214 1.055-.595
                  1.436L4 17h5m6 0v1a3 3 0
                  11-6 0v-1m6 0H9"
                />
              </svg>

              <span
                className="
                  absolute top-2 right-2
                  w-2 h-2 rounded-full
                  bg-red-500
                "
              ></span>
            </button>

            {/* User Menu */}
            <DropDownMenu user={user} />

          </div>
        ) : (
          <nav className="flex items-center gap-3">

            <NavLink
              to="/login"
              className={({ isActive }) =>
                `
                  px-4 py-2 rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  ${isActive
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-600 hover:bg-gray-100'
                }
                `
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="
                px-5 py-2 rounded-xl
                bg-black text-white
                text-sm font-medium
                hover:opacity-90
                transition-all duration-200
              "
            >
              Register
            </NavLink>

          </nav>
        )}

      </div>
    </header>
  );
}