import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/new-communities/avenir-real-estate',
        destination: '/communities/avenir',
        permanent: true,
      },
      {
        source: '/new-communities/pga-national-real-estate',
        destination: '/communities/pga-national',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
