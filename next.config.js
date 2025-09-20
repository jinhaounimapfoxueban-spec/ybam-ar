/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 明确设置输出目录
  distDir: '.next',
  
  // 确保正确的图像配置
  images: {
    domains: ['ybam-wordpress-media.s3.ap-southeast-1.amazonaws.com'],
    unoptimized: true, // 对于静态导出很重要
  },
  
  // 添加重写规则来处理SPA路由
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // 修复的headers配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: '*' 
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET, POST, PUT, DELETE, OPTIONS' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'Content-Type, Authorization, X-Requested-With' 
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ],
      },
    ];
  },
  
  // 添加trailingSlash支持
  trailingSlash: false,
  
  // 确保生产环境优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
