import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Match admin: allow backend / CDN hosts for next/image if adopted later.
    // CMS sections currently use plain <img src={absoluteUrl}> like admin.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
