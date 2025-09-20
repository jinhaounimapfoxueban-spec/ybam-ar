import clientPromise from '../../lib/mongodb';
import { verifyToken } from './auth';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('ar-project');
  
  // 验证 token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '未授权访问' });
  }
  
  try {
    const decoded = verifyToken(token);
    
    if (req.method === 'GET') {
      // 获取所有项目
      const projects = await db.collection('projects').find({}).toArray();
      res.status(200).json(projects);
    } 
    else if (req.method === 'POST') {
      // 创建新项目
      const project = {
        ...req.body,
        createdAt: new Date(),
        createdBy: decoded.userId
      };
      
      const result = await db.collection('projects').insertOne(project);
      res.status(201).json({ ...project, _id: result.insertedId });
    }
    else if (req.method === 'PUT') {
      // 更新项目
      const { id, ...updateData } = req.body;
      const result = await db.collection('projects').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: '项目未找到' });
      }
      
      res.status(200).json({ message: '项目更新成功' });
    }
    else if (req.method === 'DELETE') {
      // 删除项目
      const { id } = req.body;
      const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
      
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
