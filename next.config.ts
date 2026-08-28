import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Wildcard host: any https image URL can be passed to next/image without
     * adding it here first.
     *
     * Trade-off: this makes /_next/image an open image proxy, so third parties
     * can route their own images through it at your cost. To lock it down later,
     * replace the "**" entry with the specific hosts in use, e.g.
     *   { protocol: "https", hostname: "images.unsplash.com" }
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
