import clientPromise from '../../lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }
  
  try {
    const client = await clientPromise;
    const db = client.db('ar-project');
    
    // 查找用户
    const user = await db.collection('users').findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成 token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id.toString(), 
        username: user.username 
      } 
    });
  } catch (error) {
    console.error('认证错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
