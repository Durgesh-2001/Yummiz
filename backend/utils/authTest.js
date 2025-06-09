import jwt from 'jsonwebtoken';

export const validateAuthCookie = (cookies) => {
  const token = cookies['token'];
  if (!token) {
    throw new Error('No auth token found in cookies');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid auth token');
  }
};

export const validateCookieOptions = (res) => {
  const cookieHeader = res.get('Set-Cookie');
  if (!cookieHeader) {
    throw new Error('No cookie set in response');
  }

  const cookie = cookieHeader[0];
  const isSecure = cookie.includes('Secure');
  const isHttpOnly = cookie.includes('HttpOnly');
  const sameSite = cookie.includes('SameSite=None');

  return {
    isSecure,
    isHttpOnly,
    sameSite,
    isValid: isSecure && isHttpOnly && sameSite
  };
};
