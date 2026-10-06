const isDev = process.env.NODE_ENV !== 'production';

// Cloudflare's public test key: the widget always passes. Real keys come from the environment.
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

const contentSecurityPolicy = [
  "default-src 'self'",
  // React's dev build needs eval for stack traces; production does not.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://cdn.jsdelivr.net",
  'frame-src https://challenges.cloudflare.com',
  "connect-src 'self' https://challenges.cloudflare.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SHOW_BANNER: process.env.NEXT_PUBLIC_SHOW_BANNER ?? 'false',
    NEXT_PUBLIC_CV_UPDATED_AT: process.env.NEXT_PUBLIC_CV_UPDATED_AT ?? '06/07/2026',
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? TURNSTILE_TEST_SITE_KEY,
    NEXT_PUBLIC_GIT_COMMIT_MSG: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? '',
    NEXT_PUBLIC_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? '',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
