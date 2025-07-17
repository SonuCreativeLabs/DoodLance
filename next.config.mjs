// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode for now to prevent duplicate API calls in development
  reactStrictMode: false,
  
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
    // Enable optimized package imports
    optimizePackageImports: ['@radix-ui/react-dialog'],
  },
  
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Add any webpack configuration here if needed
    return config;
  },
};

export default nextConfig;
