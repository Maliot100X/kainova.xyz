/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure public files are served correctly
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
