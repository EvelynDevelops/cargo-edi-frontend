import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optional: Configure trailing slashes for better S3/CloudFront compatibility
  trailingSlash: true,
};

export default nextConfig;
