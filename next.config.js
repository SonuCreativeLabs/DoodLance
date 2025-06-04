/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true
  },
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
