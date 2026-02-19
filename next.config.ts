import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.newstrac.org",
          },
        ],
        destination: "https://newstrac.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
