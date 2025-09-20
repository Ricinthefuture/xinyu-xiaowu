const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 静态导出配置
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 确保路径别名正确解析
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  }
}

module.exports = nextConfig
