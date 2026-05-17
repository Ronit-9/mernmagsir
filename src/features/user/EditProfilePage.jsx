import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { FaCamera } from 'react-icons/fa';
import { updateUser } from '../../services/userSlice.js';
import { useUpdateProfileMutation } from '../../services/userApi.js';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { BASE_URL } from '../../app/mainApi.js';

function getInitials(username = '') {
  return username.split(/[\s_]+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
}

const editSchema = Yup.object({
  username: Yup.string().min(3, 'At least 3 characters').max(30, 'Max 30 characters'),
  bio: Yup.string().max(160, 'Max 160 characters').nullable().default(''),
});

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.user.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const currentAvatar = currentUser?.profilePicture
    ? `${BASE_URL}/profileuploads/${currentUser.profilePicture}`
    : null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) { toast.error('Only jpg, jpeg, png, gif allowed'); return; }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formik = useFormik({
    initialValues: {
      username: currentUser?.username || '',
      bio: currentUser?.bio || '',
    },
    validationSchema: editSchema,
    onSubmit: async (values, { setFieldError }) => {
      const formData = new FormData();
      if (values.username !== currentUser?.username) formData.append('username', values.username);
      formData.append('bio', values.bio);
      if (imageFile) formData.append('profilePicture', imageFile);

      try {
        const updated = await updateProfile({ id: currentUser.id, formData }).unwrap();
        dispatch(updateUser({ username: updated.username, bio: updated.bio, profilePicture: updated.profilePicture }));
        toast.success('Profile updated');
        navigate(`/profile/${currentUser.id}`);
      } catch (err) {
        const msg = err?.data?.msg || 'Update failed';
        if (msg.toLowerCase().includes('username')) setFieldError('username', 'Username already taken');
        else toast.error(msg);
      }
    },
  });

  const fieldErr = (name) => formik.touched[name] && formik.errors[name] ? formik.errors[name] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-zinc-100 to-gray-200 px-4 py-6 sm:py-10">
      <div className="max-w-lg sm:max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden bg-white">

          {/* Banner */}
          <div className="h-24 sm:h-36 bg-gradient-to-br from-zinc-900 via-neutral-800 to-zinc-700 relative">
            <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-xl">
                  {(preview || currentAvatar) && (
                    <AvatarImage src={preview || currentAvatar} alt={currentUser?.username} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl sm:text-3xl font-bold">
                    {getInitials(currentUser?.username)}
                  </AvatarFallback>
                </Avatar>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border border-gray-200 text-black flex items-center justify-center shadow-md hover:bg-gray-100 transition">
                  <FaCamera className="text-xs sm:text-sm" />
                </button>
              </div>
            </div>
          </div>

          <CardContent className="pt-16 sm:pt-20 pb-8 sm:pb-10 px-5 sm:px-10">

            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Profile</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your personal information</p>
            </div>

            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handleImageChange} />

            {preview && (
              <div className="flex justify-center mb-4 sm:mb-5">
                <button type="button" onClick={removeImage}
                  className="text-xs text-red-500 hover:text-red-600">
                  Remove selected image
                </button>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-5 sm:space-y-6">

              <div>
                <Label className="text-sm">Username</Label>
                <Input
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-10 sm:h-11 rounded-xl bg-gray-50 border mt-1.5 text-sm ${fieldErr('username') ? 'border-red-400' : 'border-gray-200'}`}
                />
                {fieldErr('username') && <p className="text-xs text-red-500 mt-1">{fieldErr('username')}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Bio</Label>
                  <span className="text-xs text-gray-400">{formik.values.bio.length}/160</span>
                </div>
                <textarea
                  name="bio"
                  rows={3}
                  maxLength={160}
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  className="w-full mt-1.5 rounded-xl bg-gray-50 border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-gray-400"
                />
                {fieldErr('bio') && <p className="text-xs text-red-500 mt-1">{fieldErr('bio')}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline"
                  className="flex-1 rounded-xl h-10 sm:h-11 text-sm"
                  onClick={() => navigate(`/profile/${currentUser?.id}`)}>
                  Cancel
                </Button>
                <Button type="submit"
                  disabled={isLoading || (!formik.dirty && !imageFile)}
                  className="flex-1 rounded-xl h-10 sm:h-11 bg-black hover:bg-gray-900 text-white text-sm">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}