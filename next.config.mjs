/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable experimental middleware support
  experimental: {
    appDir: true,
    middleware: true,
  },
};

export default nextConfig;
