export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://yummiz.up.railway.app';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // Return the Cloudinary URL directly
  return imagePath;
};
