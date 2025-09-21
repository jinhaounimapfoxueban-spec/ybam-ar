export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 在Netlify上，文件上传需要使用其他方式处理
  // 这里返回一个错误，提示使用其他方法
  res.status(501).json({ 
    error: '文件上传功能在Netlify上需要使用其他实现方式',
    suggestion: '考虑使用云存储服务如AWS S3、Cloudinary或Vercel Blob'
  });
}
