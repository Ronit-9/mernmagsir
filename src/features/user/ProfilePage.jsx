import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useGetUserProfileQuery, useFollowUserMutation } from '../../services/userApi.js';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BASE_URL } from '../../app/mainApi.js';

function getInitials(username = '') {
  return username.split(/[\s_]+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
      {post.image && (
        <img
          src={`${BASE_URL}/uploads/${post.image}`}
          alt="Post"
          className="w-full max-h-[280px] sm:max-h-[400px] object-cover"
        />
      )}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <p className="text-sm sm:text-[15px] leading-relaxed text-gray-800">{post.content}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><span className="text-red-500">♥</span>{post.likes?.length ?? 0}</span>
            <span className="flex items-center gap-1"><span>💬</span>{post.comments?.length ?? 0}</span>
          </div>
          <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function UserListItem({ user, onClick }) {
  const avatarSrc = user?.profilePicture ? `${BASE_URL}/profileuploads/${user.profilePicture}` : null;
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:py-3 hover:bg-gray-50 transition text-left">
      <Avatar className="h-9 w-9 sm:h-11 sm:w-11 shrink-0">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={user.username} />}
        <AvatarFallback className="bg-black text-white text-xs sm:text-sm font-semibold">
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
        <p className="text-xs text-gray-400">View profile</p>
      </div>
    </button>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.user.user);
  const isOwnProfile = currentUser?.id === id;

  const { data, isLoading, isError } = useGetUserProfileQuery(id);
  const [followUser, { isLoading: followLoading }] = useFollowUserMutation();

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="h-9 w-9 sm:h-10 sm:w-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-[60vh] text-gray-500 text-sm">
      User not found
    </div>
  );

  const { user, posts } = data;
  const avatarSrc = user?.profilePicture ? `${BASE_URL}/profileuploads/${user.profilePicture}` : null;
  const isFollowing = user.followers?.some((f) => f._id === currentUser?.id || f === currentUser?.id);

  const handleFollow = async () => {
    try {
      const res = await followUser(id).unwrap();
      toast.success(res.following ? 'Followed user' : 'Unfollowed user');
    } catch { toast.error('Something went wrong'); }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-2xl sm:max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">

        {/* Profile card */}
        <div className="bg-white rounded-2xl sm:rounded-[36px] overflow-hidden shadow-sm border border-gray-100">

          {/* Banner */}
          <div className="h-28 sm:h-44 bg-gradient-to-r from-black via-gray-900 to-gray-700" />

          <div className="px-4 sm:px-8 pb-6 sm:pb-8 relative">
            <div className="-mt-12 sm:-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-5">

              <div className="flex flex-row sm:flex-row items-end gap-3 sm:gap-5">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 sm:border-[6px] border-white shadow-xl shrink-0">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt={user.username} className="object-cover" />}
                  <AvatarFallback className="bg-black text-white text-2xl sm:text-3xl font-bold">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>

                <div className="pb-1 sm:pb-2">
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">{user.username}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="sm:pb-2 self-start sm:self-auto mt-1 sm:mt-0">
                {isOwnProfile ? (
                  <Button onClick={() => navigate(`/profile/${id}/edit`)}
                    className="h-9 sm:h-11 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-black hover:bg-gray-900 text-white text-xs sm:text-sm">
                    Edit Profile
                  </Button>
                ) : (
                  <Button onClick={handleFollow} disabled={followLoading}
                    variant={isFollowing ? 'outline' : 'default'}
                    className={`h-9 sm:h-11 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm ${isFollowing ? 'border-gray-300' : 'bg-black hover:bg-gray-900 text-white'}`}>
                    {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>

            {user.bio && (
              <p className="mt-4 sm:mt-6 text-sm sm:text-[15px] leading-relaxed text-gray-700 max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 mt-5 sm:mt-8 flex-wrap">
              {[
                { label: 'Posts', value: posts?.length ?? 0 },
                { label: 'Followers', value: user.followers?.length ?? 0 },
                { label: 'Following', value: user.following?.length ?? 0 },
              ].map(({ label, value }) => (
                <div key={label}>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{value}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="grid grid-cols-3 bg-white rounded-xl sm:rounded-2xl h-12 sm:h-14 border border-gray-100 shadow-sm">
            {[
              { value: 'posts', label: 'Posts', count: posts?.length },
              { value: 'followers', label: 'Followers', count: user.followers?.length },
              { value: 'following', label: 'Following', count: user.following?.length },
            ].map(({ value, label, count }) => (
              <TabsTrigger key={value} value={value}
                className="rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium">
                {label}
                {count > 0 && (
                  <Badge className="ml-1.5 rounded-full px-1.5 sm:px-2 text-xs bg-black text-white hover:bg-black">
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="posts" className="mt-4 sm:mt-5 flex flex-col gap-4 sm:gap-5">
            {posts?.length === 0
              ? <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center text-gray-400 text-sm">No posts yet</div>
              : posts.map((post) => <PostCard key={post._id} post={post} />)
            }
          </TabsContent>

          {[
            { value: 'followers', list: user.followers, empty: 'No followers yet' },
            { value: 'following', list: user.following, empty: 'Not following anyone' },
          ].map(({ value, list, empty }) => (
            <TabsContent key={value} value={value} className="mt-4 sm:mt-5">
              {list?.length === 0
                ? <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center text-gray-400 text-sm">{empty}</div>
                : <div className="bg-white rounded-2xl border border-gray-100 p-2 sm:p-3 flex flex-col gap-1">
                  {list.map((f) => (
                    <UserListItem key={f._id} user={f} onClick={() => navigate(`/profile/${f._id}`)} />
                  ))}
                </div>
              }
            </TabsContent>
          ))}
        </Tabs>

      </div>
    </div>
  );
}