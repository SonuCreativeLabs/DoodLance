import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    domains: ['localhost', '127.0.0.1', 'atmxiuindyakhqmdqzal.supabase.co', 'umeqaqwidjdgnwkxedaw.supabase.co', 'api.dicebear.com', 'images.unsplash.com'],
  },

  // Static asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,

  // Enable static export optimization only in production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),

  // Ensure proper MIME types
  poweredByHeader: false,

  // Add compression
  compress: true,
  
  // TypeScript and ESLint configurations
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Custom webpack configuration
  webpack: (config, { isServer, dev }) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // Ensure proper MIME types in development
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Content-Type': 'application/javascript; charset=utf-8',
        },
      };
    }

    // Add any additional webpack configurations here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  
  // Environment variables
  env: {
    // Add any environment variables that should be available at build time
  },
  
  // Headers configuration
  async headers() {
    const previewOrigins = "http://localhost:* http://127.0.0.1:*";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${previewOrigins}`,
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  
  // Custom rewrites
  async rewrites() {
    return [
      // Add any custom rewrites here
      // Example:
      // {
      //   source: '/api/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
    ];
  },
  
  // Server Actions are enabled by default in Next.js 14+
  experimental: {
    // Add any experimental features here
  }
};

export default nextConfig;
