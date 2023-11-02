const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_DIRECTUS_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_DIRECTUS_HOST,
        port: process.env.NEXT_PUBLIC_DIRECTUS_PORT,
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
