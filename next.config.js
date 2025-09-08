/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'res.cloudinary.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['prisma']
  },
  // Optimize for Vercel deployment
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('socket.io')
    }
    return config
  },
  // Force dynamic rendering for API routes
  output: 'standalone',
  // Enable metadata base for social sharing
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Skip static generation errors during build
  trailingSlash: false,
  generateBuildId: async () => {
    return 'guffghar-build-' + Date.now()
  }
}

module.exports = nextConfig