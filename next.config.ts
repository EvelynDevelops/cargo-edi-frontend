import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // Enable static HTML export
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optional: Configure trailing slashes for better S3/CloudFront compatibility
  trailingSlash: true,
};

export default nextConfig;
