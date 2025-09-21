import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 确保上传目录存在
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 手动解析multipart/form-data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    const boundary = req.headers['content-type'].split('boundary=')[1];
    const parts = buffer.toString().split(`--${boundary}`);
    
    const files = {};
    const fields = {};
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        const filenameMatch = part.match(/filename="([^"]+)"/);
        const nameMatch = part.match(/name="([^"]+)"/);
        const contentTypeMatch = part.match(/Content-Type:\s*([^\r\n]+)/);
        
        if (filenameMatch && nameMatch) {
          const filename = filenameMatch[1];
          const fieldName = nameMatch[1];
          const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
          
          const fileStart = part.indexOf('\r\n\r\n') + 4;
          const fileEnd = part.lastIndexOf('\r\n');
          const fileData = part.substring(fileStart, fileEnd);
          
          const fileBuffer = Buffer.from(fileData);
          const uniqueFilename = `${Date.now()}-${filename}`;
          const filePath = path.join(uploadDir, uniqueFilename);
          
          await fs.writeFile(filePath, fileBuffer);
          
          files[fieldName] = {
            filename: uniqueFilename,
            originalFilename: filename,
            contentType,
            path: filePath,
            url: `/uploads/${uniqueFilename}`
          };
        }
      } else if (part.includes('name="')) {
        const nameMatch = part.match(/name="([^"]+)"/);
        if (nameMatch) {
          const fieldName = nameMatch[1];
          const valueStart = part.indexOf('\r\n\r\n') + 4;
          const valueEnd = part.lastIndexOf('\r\n');
          const value = part.substring(valueStart, valueEnd);
          fields[fieldName] = value;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: '文件上传成功',
      files,
      fields
    });

  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: '文件上传失败' });
  }
}
