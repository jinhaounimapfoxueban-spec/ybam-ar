import { parseForm, getFileUrl } from '../../lib/fileUpload';
import path from 'path';
import fs from 'fs';

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
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    const { fields, files } = await parseForm(req, uploadDir);

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file;
    const filename = `${Date.now()}-${file.originalFilename}`;
    const newPath = path.join(uploadDir, filename);

    // 重命名文件
    fs.renameSync(file.filepath, newPath);

    const fileUrl = getFileUrl(filename, req);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename: filename,
      url: fileUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
}
