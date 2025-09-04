/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 解决 vendor chunks 问题
  experimental: {
    optimizePackageImports: [],
    webpackBuildWorker: false
  }
}

export default nextConfig
