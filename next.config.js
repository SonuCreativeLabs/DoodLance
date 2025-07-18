/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Enable React Strict Mode
  reactStrictMode: true,
  // Enable TypeScript type checking
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable ESLint on build
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Add any necessary webpack configuration
  webpack: (config, { isServer }) => {
    // Add any webpack configurations here if needed
    return config;
  },
  // Environment variables
  env: {
    // Add any environment variables that should be available at build time
  },
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
