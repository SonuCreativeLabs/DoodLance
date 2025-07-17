// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Enable production browser source maps
  productionBrowserSourceMaps: true,
  
  // Configure images
  images: {
    // Enable image optimization
    unoptimized: false,
    // Allow images from these domains
    domains: [
      'localhost',
      '127.0.0.1',
      'images.unsplash.com',
      'atmxiuindyakhqmdqzal.supabase.co',
    ],
  },
  
  // Enable experimental features
  experimental: {
    // Enable server components external packages
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  
  // Disable Babel as we're using SWC
  swcMinify: true,
};

export default nextConfig;
