/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 静态导出配置
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  // 禁用服务器端功能以支持静态导出
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig
