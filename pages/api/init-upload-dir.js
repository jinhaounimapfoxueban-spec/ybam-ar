import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      await fs.access(uploadDir);
      res.status(200).json({ message: '上传目录已存在' });
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
      res.status(200).json({ message: '上传目录创建成功' });
    }
  } catch (error) {
    console.error('初始化上传目录错误:', error);
    res.status(500).json({ error: '初始化失败' });
  }
}
