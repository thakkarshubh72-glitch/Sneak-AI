/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sneak-ai',
  images: {
    domains: ['images.unsplash.com', 'unsplash.com', 'localhost'],
    unoptimized: true,
  },
  transpilePackages: ['three'],
}

module.exports = nextConfig
