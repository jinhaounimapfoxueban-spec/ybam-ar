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
    
    // 验证 token (除了 OPTIONS 请求)
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
      const projects = await db.collection('projects').find({}).toArray();
      res.status(200).json(projects);
    } 
    else if (req.method === 'POST') {
      // 创建新项目
      const {
