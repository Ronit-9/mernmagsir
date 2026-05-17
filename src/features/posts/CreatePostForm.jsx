import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useCreatePostMutation } from '../../services/Post.js';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FaImage, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../../app/mainApi.js';

function getInitials(username = '') {
  return username.split(/[\s_]+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
}

export default function CreatePostForm() {
  const currentUser = useSelector((s) => s.user.user);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const avatarSrc = currentUser?.profilePicture
    ? `${BASE_URL}/profileuploads/${currentUser.profilePicture}`
    : null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim()) { toast.error('Write something first'); return; }
    if (!imageFile) { toast.error('Please add an image'); return; }

    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('image', imageFile);

    try {
      await createPost(formData).unwrap();
      toast.success('Post created');
      setContent('');
      removeImage();
    } catch (err) {
      toast.error(err?.data?.msg || 'Failed to create post');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-5">

      {/* Top row */}
      <div className="flex gap-3 sm:gap-4">
        <Avatar className="h-9 w-9 sm:h-11 sm:w-11 shrink-0">
          {avatarSrc && <AvatarImage src={avatarSrc} />}
          <AvatarFallback className="bg-black text-white text-sm">
            {getInitials(currentUser?.username)}
          </AvatarFallback>
        </Avatar>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's happening, ${currentUser?.username}?`}
          rows={3}
          maxLength={500}
          className="w-full resize-none outline-none text-sm sm:text-[15px] text-gray-800 pt-1 placeholder-gray-400"
        />
      </div>

      {/* Image preview */}
      {preview && (
        <div className="mt-3 relative">
          <img src={preview} className="w-full max-h-[300px] sm:max-h-[400px] object-cover rounded-xl sm:rounded-2xl border" />
          <button onClick={removeImage}
            className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black">
            <FaTimes size={11} />
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div>
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" className="hidden" onChange={handleImageChange} />
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm font-medium text-gray-700 transition">
            <FaImage />
            <span>Photo</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`text-xs hidden sm:block ${content.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>
            {content.length}/500
          </span>
          <Button onClick={handleSubmit}
            disabled={isLoading || !content.trim() || !imageFile}
            className="h-8 sm:h-10 px-4 sm:px-5 rounded-lg sm:rounded-xl bg-black hover:bg-gray-800 text-white text-xs sm:text-sm">
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

    </div>
  );
}