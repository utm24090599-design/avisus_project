export function buildSecurityHeaders(env: 'dev' | 'prod') {
  const isDev = env === 'dev';

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' https://accounts.google.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
    "img-src 'self' data: https://accounts.google.com https://placehold.co",
    "connect-src 'self' http://localhost:8000 https://accounts.google.com https://www.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-src https://accounts.google.com",
  ];

  return {
    'Content-Security-Policy': cspDirectives.join('; '),
    'Cross-Origin-Opener-Policy': isDev ? 'unsafe-none' : 'same-origin',
    'worker-src': isDev ? "'self' blob:" : "'self'",
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}
