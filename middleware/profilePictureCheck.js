import cloudinary from "../utils/cloudinary.js";

const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// PUT /api/users/:id — profile picture is optional
export const profilePictureCheck = async (req, res, next) => {
  const file = req.files?.profilePicture;

  if (!file) return next(); // no picture attached — skip

  if (!supportedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only jpg, jpeg, png, gif allowed.',
    });
  }

  try {
    const url = await uploadToCloudinary(file.data, 'profiles');
    req.imagePath = url; // full https://res.cloudinary.com/... URL
    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ message: 'Profile picture upload failed' });
  }
};