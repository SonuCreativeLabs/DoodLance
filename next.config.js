/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to enable server-side rendering for dynamic routes
  images: {
    unoptimized: true,
    domains: ['atmxiuindyakhqmdqzal.supabase.co'],
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
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
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
  // Disable static optimization for all pages
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
