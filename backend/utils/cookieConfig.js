const isProduction = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'None' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
  domain: isProduction ? '.railway.app' : 'localhost'
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  path: '/'
};
