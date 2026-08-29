import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Only hosts actually referenced by content belong here. A "**" wildcard
     * turns /_next/image into an open image proxy that third parties can route
     * their own images through at this project's cost, so new hosts are added
     * deliberately rather than allowed by default.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],

    /**
     * Any `quality` a component asks for must be declared here. Without this
     * list Next silently falls back to 75 -- the hero was requesting q=90 and
     * being served q=75, with no warning anywhere.
     */
    qualities: [75, 90],
  },

  /**
   * Every canonical URL declares the apex domain, so the www host must not
   * serve the same pages. Without this both hosts are indexable and compete.
   * `permanent: true` emits a 308, which Google treats the same as a 301.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mehediimun.com" }],
        destination: "https://mehediimun.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
