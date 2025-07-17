/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  // Enable production browser source maps
  productionBrowserSourceMaps: true,
  // Enable standalone output for Vercel
  output: 'standalone',
  
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
    // Configure remote patterns for image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure static files are served correctly
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  // Use standalone output for production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Add base path if your app is not served from the root
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Add trailing slash for static exports
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/client/hires',
        destination: '/client/bookings',
        permanent: true,
      },
    ]
  },
  // Enable React Strict Mode for development
  reactStrictMode: true,
  // Enable production browser source maps
  productionBrowserSourceMaps: true,
  // Disable static pages optimization for now
  output: 'standalone',
  // Custom error handling
  async rewrites() {
    return [
      // Handle client-side routing for all routes
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
}

module.exports = nextConfig
