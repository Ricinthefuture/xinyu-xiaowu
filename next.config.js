const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 标准配置
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
  },
  // 实验性功能，提高兼容性
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
}

module.exports = nextConfig
