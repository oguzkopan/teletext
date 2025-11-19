/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  // Requirement: Optimize bundle size to < 200KB initial load
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Code splitting configuration
  // Requirement: Add code splitting by magazine (lazy load adapters)
  experimental: {
    optimizePackageImports: ['@/components', '@/hooks', '@/lib'],
  },
  
  // Allow service worker to be served from public directory
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate chunks for components
            components: {
              name: 'components',
              test: /[\\/]components[\\/]/,
              chunks: 'all',
              priority: 15,
            },
            // Separate chunks for hooks
            hooks: {
              name: 'hooks',
              test: /[\\/]hooks[\\/]/,
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
