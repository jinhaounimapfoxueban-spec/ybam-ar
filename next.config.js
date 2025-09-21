/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 增加上传文件大小限制
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
  // 允许大文件上传
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
  },
};

module.exports = nextConfig;
