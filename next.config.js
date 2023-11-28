const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
  PHASE_DEVELOPMENT_SERVER,
} = require('next/constants')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: '.next-temp',
  transpilePackages: ['pdfmake', 'lodash-es'],
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

module.exports = (phase) => {
  let distDir = ''
  if (phase == PHASE_PRODUCTION_BUILD) {
    distDir = '.next-temp'
  } else if (
    phase == PHASE_PRODUCTION_SERVER ||
    phase == PHASE_DEVELOPMENT_SERVER
  ) {
    distDir = '.next'
  }

  return withBundleAnalyzer({
    ...nextConfig,
    distDir,
  })
}
