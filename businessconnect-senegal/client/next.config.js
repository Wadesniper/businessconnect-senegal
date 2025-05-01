/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'businessconnect-senegal.vercel.app',
      'api.businessconnect-senegal.com',
      'storage.googleapis.com'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYTECH_URL: process.env.NEXT_PUBLIC_PAYTECH_URL,
  }
};

module.exports = nextConfig; 