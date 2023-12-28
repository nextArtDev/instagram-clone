/** @type {import('next').NextConfig} */
const nextConfig = {
  //   experimental: {
  //     appDir: true,
  //     serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  //   },
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt']
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mye-commerce.storage.iran.liara.space',
      },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
