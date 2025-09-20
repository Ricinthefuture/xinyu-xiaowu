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
  // Cloudflare Pages 兼容性设置
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
}

module.exports = nextConfig
