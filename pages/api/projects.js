import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from './auth';
import { parseForm, getFileUrl } from '../../lib/fileUpload';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const client = await clientPromise;
    const db = client.db('ar-project');
    
    // 验证 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' });
    }
    
    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Token无效' });
    }
    
    if (req.method === 'GET') {
      // 获取所有项目
      const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(projects);
    } 
    else if (req.method === 'POST') {
      // 创建新项目 - 处理文件上传
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const { fields, files } = await parseForm(req, uploadDir);

      const { name } = fields;
      
      if (!name || !name[0]) {
        return res.status(400).json({ message: '项目名称不能为空' });
      }

      let originalImage = '';
      let videoURL = '';

      // 处理图片上传
      if (files.originalImage) {
        const imageFile = files.originalImage[0];
        const imageFilename = `image-${Date.now()}-${imageFile.originalFilename}`;
        const imagePath = path.join(uploadDir, imageFilename);
        fs.renameSync(imageFile.filepath, imagePath);
        originalImage = getFileUrl(imageFilename, req);
      }

      // 处理视频上传
      if (files.videoURL) {
        const videoFile = files.videoURL[0];
        const videoFilename = `video-${Date.now()}-${videoFile.originalFilename}`;
        const videoPath = path.join(uploadDir, videoFilename);
        fs.renameSync(videoFile.filepath, videoPath);
        videoURL = getFileUrl(videoFilename, req);
      }

      if (!originalImage || !videoURL) {
        return res.status(400).json({ message: '请上传图片和视频文件' });
      }
      
      const project = {
        name: name[0],
        originalImage,
        videoURL,
        status: '已发布',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: decoded.userId
      };
      
      const result = await db.collection('projects').insertOne(project);
      res.status(201).json({ ...project, _id: result.insertedId });
    }
    else if (req.method === 'PUT') {
      // 更新项目 - 处理文件上传
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const { fields, files } = await parseForm(req, uploadDir);

      const { id, name } = fields;
      
      if (!id || !id[0] || !name || !name[0]) {
        return res.status(400).json({ message: '项目ID和名称不能为空' });
      }

      const updateData = {
        name: name[0],
        updatedAt: new Date()
      };

      // 处理图片上传（如果有）
      if (files.originalImage) {
        const imageFile = files.originalImage[0];
        const imageFilename = `image-${Date.now()}-${imageFile.originalFilename}`;
        const imagePath = path.join(uploadDir, imageFilename);
        fs.renameSync(imageFile.filepath, imagePath);
        updateData.originalImage = getFileUrl(imageFilename, req);
      }

      // 处理视频上传（如果有）
      if (files.videoURL) {
        const videoFile = files.videoURL[0];
        const videoFilename = `video-${Date.now()}-${videoFile.originalFilename}`;
        const videoPath = path.join(uploadDir, videoFilename);
        fs.renameSync(videoFile.filepath, videoPath);
        updateData.videoURL = getFileUrl(videoFilename, req);
      }
      
      const result = await db.collection('projects').updateOne(
        { _id: new ObjectId(id[0]) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: '项目未找到' });
      }
      
      res.status(200).json({ message: '项目更新成功' });
    }
    else if (req.method === 'DELETE') {
      // 删除项目 - 需要解析JSON body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const { id } = JSON.parse(body);
          
          if (!id) {
            return res.status(400).json({ message: '项目ID不能为空' });
          }
          
          // 先获取项目信息以便删除文件
          const project = await db.collection('projects').findOne({ 
            _id: new ObjectId(id) 
          });
          
          if (project) {
            // 删除文件（可选）
            // 这里可以添加删除物理文件的逻辑
          }
          
          const result = await db.collection('projects').deleteOne({ 
            _id: new ObjectId(id) 
          });
          
          if (result.deletedCount === 0) {
            return res.status(404).json({ message: '项目未找到' });
          }
          
          res.status(200).json({ message: '项目删除成功' });
        } catch (error) {
          console.error('Delete error:', error);
          res.status(500).json({ message: '服务器内部错误' });
        }
      });
      
      return;
    }
    else {
      res.status(405).json({ message: '方法不允许' });
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
