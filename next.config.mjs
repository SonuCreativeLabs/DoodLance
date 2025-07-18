import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Enable image optimization for local images
    domains: ['localhost', '127.0.0.1'],
    // Keep unoptimized as true for now to debug
    unoptimized: true,
    // Ensure images are served from the correct path
    path: '/_next/image',
    // Disable image optimization in development
    disableStaticImages: false,
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

// Use ES modules export
export default nextConfig
