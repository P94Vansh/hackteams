import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true, // ✅ disables lint errors from breaking your build
  },
};

export default nextConfig;
