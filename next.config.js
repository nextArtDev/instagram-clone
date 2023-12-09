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
}

module.exports = nextConfig
