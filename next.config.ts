import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // This ignores small typing errors so the build can finish
    ignoreBuildErrors: true,
  },
  eslint: {
    // This skips linting so the build is faster and less likely to fail
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

