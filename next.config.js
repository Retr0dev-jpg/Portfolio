/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GIT_COMMIT_MSG: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? '',
    NEXT_PUBLIC_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? '',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_CV_UPDATED_AT: '03/04/2026',
  },
};

module.exports = nextConfig;
