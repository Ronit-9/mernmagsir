import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../services/userSlice.js';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';

import { BASE_URL } from '../app/mainApi.js';

// ✅ React Icons ONLY
import { FaHome } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';

function getInitials(username = '') {
  return username
    .split(/[\s_]+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export default function DropDownMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const avatarSrc = user?.profilePicture
  //   ? `${BASE_URL}/profileuploads/${user.profilePicture}`
  //   : null;
  const avatarSrc = user?.profilePicture || null;

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <DropdownMenu>

      {/* Trigger */}
      <DropdownMenuTrigger
        className="
          flex items-center gap-2
          rounded-full px-2 py-1.5
          hover:bg-gray-100
          transition
          outline-none
        "
      >
        <Avatar className="h-9 w-9">
          {avatarSrc && (
            <AvatarImage
              src={avatarSrc}
              alt={user?.username}
            />
          )}

          <AvatarFallback className="bg-black text-white text-xs font-medium">
            {getInitials(user?.username)}
          </AvatarFallback>
        </Avatar>

        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-sm font-medium text-black max-w-[120px] truncate">
            {user?.username}
          </span>

          <span className="text-xs text-gray-400 max-w-[120px] truncate mt-1">
            {user?.email}
          </span>
        </div>

        <div className="hidden sm:block text-gray-400 text-xs">
          ▼
        </div>
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-2xl border border-gray-200 bg-white shadow-xl p-2"
      >

        {/* User Info */}
        <DropdownMenuLabel className="p-2">
          <div className="flex items-center gap-3">

            <Avatar className="h-11 w-11">
              {avatarSrc && (
                <AvatarImage
                  src={avatarSrc}
                  alt={user?.username}
                />
              )}

              <AvatarFallback className="bg-black text-white text-sm font-medium">
                {getInitials(user?.username)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {user?.username}
              </p>

              <p className="text-xs text-gray-400 truncate mt-1">
                {user?.email}
              </p>
            </div>

          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Home */}
        <DropdownMenuItem
          onClick={() => navigate('/')}
          className="cursor-pointer rounded-xl px-3 py-3 flex items-center gap-3"
        >
          <FaHome className="text-base text-gray-700" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">Home</span>
            <span className="text-xs text-gray-400">Latest posts</span>
          </div>
        </DropdownMenuItem>

        {/* Profile */}
        <DropdownMenuItem
          onClick={() => navigate(`/profile/${user?.id}`)}
          className="cursor-pointer rounded-xl px-3 py-3 flex items-center gap-3"
        >
          <FaUser className="text-base text-gray-700" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">Profile</span>
            <span className="text-xs text-gray-400">View your profile</span>
          </div>
        </DropdownMenuItem>

        {/* Edit */}
        <DropdownMenuItem
          onClick={() => navigate(`/profile/${user?.id}/edit`)}
          className="cursor-pointer rounded-xl px-3 py-3 flex items-center gap-3"
        >
          <FaEdit className="text-base text-gray-700" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">Edit Profile</span>
            <span className="text-xs text-gray-400">Update your details</span>
          </div>
        </DropdownMenuItem>

        {/* Search */}
        <DropdownMenuItem
          onClick={() => navigate('/search')}
          className="cursor-pointer rounded-xl px-3 py-3 flex items-center gap-3"
        >
          <FaSearch className="text-base text-gray-700" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">Search</span>
            <span className="text-xs text-gray-400">Find users</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-xl px-3 py-3 flex items-center gap-3 text-red-500 focus:bg-red-50 focus:text-red-500"
        >
          <FaSignOutAlt className="text-base text-red-500" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">Logout</span>
            <span className="text-xs text-red-400">Sign out</span>
          </div>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}