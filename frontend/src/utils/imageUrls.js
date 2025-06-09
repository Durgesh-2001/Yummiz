const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL (Cloudinary), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Fallback for local uploads
  return `${BACKEND_URL}/uploads/${imageUrl}`;
};
