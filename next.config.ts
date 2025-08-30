import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // simple allow-list for well-known hosts
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      // add any other hosts you expect (e.g. your CDN)
    ],
    // optional: remotePatterns for more flexible matching
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
