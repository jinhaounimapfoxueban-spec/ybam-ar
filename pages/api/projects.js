import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from './auth';

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
      const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(projects);
    } 
    else if (req.method === 'POST') {
      const { name, originalImage, videoURL } = req.body;
      
      if (!name || !originalImage || !videoURL) {
        return res.status(400).json({ message: '请填写所有字段' });
      }
      
      const project = {
        name,
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
      const { id, name, originalImage, videoURL } = req.body;
      
      if (!id || !name) {
        return res.status(400).json({ message: '项目ID和名称不能为空' });
      }
      
      const updateData = {
        name,
        updatedAt: new Date()
      };
      
      if (originalImage) updateData.originalImage = originalImage;
      if (videoURL) updateData.videoURL = videoURL;
      
      const result = await db.collection('projects').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: '项目未找到' });
      }
      
      res.status(200).json({ message: '项目更新成功' });
    }
    else if (req.method === 'DELETE') {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: '项目ID不能为空' });
      }
      
      const result = await db.collection('projects').deleteOne({ 
        _id: new ObjectId(id) 
      });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: '项目未找到' });
      }
      
      res.status(200).json({ message: '项目删除成功' });
    }
    else {
      res.status(405).json({ message: '方法不允许' });
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
