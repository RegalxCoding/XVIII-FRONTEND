import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.2", "eager-paws-boil.loca.lt", "192.168.1.4"],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
