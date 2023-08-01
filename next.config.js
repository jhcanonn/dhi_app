const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_DIRECTUS_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_DIRECTUS_HOST,
        port: process.env.NEXT_PUBLIC_DIRECTUS_PORT,
        pathname: '/assets/**',
      },
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
