import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
};

module.exports = {
  allowedDevOrigins: ["192.168.100.17"],
};
export default nextConfig;
