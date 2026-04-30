import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'grameen-connect/avatars',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
  },
});

export const upload = multer({ storage });

export const uploadToCloudinary = async (fileBuffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default cloudinary;
