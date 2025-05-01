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
}

module.exports = nextConfig
