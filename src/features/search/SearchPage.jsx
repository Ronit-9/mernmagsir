import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useSearchUsersQuery } from '../../services/userApi.js';
import { useFollowUserMutation } from '../../services/userApi.js';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BASE_URL } from '../../app/mainApi.js';

function getInitials(username = '') {
  return username.split(/[\s_]+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
}

export default function SearchPage() {
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.user.user);

  // Input value — what user is typing
  const [inputVal, setInputVal] = useState('');
  // Committed query — only updates on Enter or button click
  const [query, setQuery] = useState('');

  // Only fires when query is non-empty (skip: !query)
  const { data: results, isLoading, isFetching } = useSearchUsersQuery(query, {
    skip: !query.trim(),
  });

  const [followUser, { isLoading: followLoading }] = useFollowUserMutation();

  // ── Fire search ────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const q = inputVal.trim();
    if (!q) return;
    setQuery(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setInputVal('');
    setQuery('');
  };

  // ── Follow toggle ──────────────────────────────────────────────────────────
  const handleFollow = async (userId) => {
    try {
      const res = await followUser(userId).unwrap();
      toast.success(res.following ? 'Followed!' : 'Unfollowed');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const loading = isLoading || isFetching;

  return (
    <div className="max-w-xl mx-auto py-8 px-4 flex flex-col gap-6">

      {/* ── Page title ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Search Users</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Find people by username
        </p>
      </div>

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>

          <Input
            type="text"
            placeholder="Search by username…"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-9"
            autoFocus
          />

          {/* Clear button — shows when there's input */}
          {inputVal && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2
                text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <Button
          onClick={handleSearch}
          disabled={!inputVal.trim() || loading}
          className="shrink-0"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : 'Search'}
        </Button>
      </div>

      {/* ── Results ────────────────────────────────────────────────────────── */}

      {/* No query yet */}
      {!query && (
        <div className="flex flex-col items-center gap-2 py-16 text-gray-300">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <p className="text-sm">Type a username and press Enter or Search</p>
        </div>
      )}

      {/* Loading */}
      {query && loading && (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      )}

      {/* No results */}
      {query && !loading && results?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-gray-300">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">No users found for "<span className="font-medium text-gray-400">{query}</span>"</p>
        </div>
      )}

      {/* Results list */}
      {query && !loading && results?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 mb-1">
            {results.length} result{results.length !== 1 ? 's' : ''} for "
            <span className="font-medium text-gray-500">{query}</span>"
          </p>

          {results.map((user) => {
            const avatarSrc = user.profilePicture
              ? `${BASE_URL}/profileuploads/${user.profilePicture}`
              : null;

            const isMe = user._id === currentUser?.id;

            return (
              <div
                key={user._id}
                className="bg-white rounded-2xl border border-gray-100 p-4
                  flex items-center gap-3 hover:shadow-sm transition-shadow"
              >
                {/* Avatar — clicks to profile */}
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-12 w-12">
                    {avatarSrc && (
                      <AvatarImage src={avatarSrc} alt={user.username} />
                    )}
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Info */}
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="flex-1 text-left hover:opacity-80 transition-opacity min-w-0"
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.username}
                  </p>
                  {user.bio && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {user.bio}
                    </p>
                  )}
                </button>

                {/* Follow button — hidden on own profile */}
                {!isMe && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    disabled={followLoading}
                    onClick={() => handleFollow(user._id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}