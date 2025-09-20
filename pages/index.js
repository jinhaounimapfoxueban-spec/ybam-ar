import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [detected, setDetected] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      if (token && user) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('您的浏览器不支持摄像头功能');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      
      const detectionInterval = setInterval(() => {
        const isDetected = Math.random() > 0.7;
        setDetected(isDetected);
        
        if (isDetected && projects.length > 0) {
          setCurrentProject(projects[0]);
        } else {
          setCurrentProject(null);
        }
      }, 2000);
      
      return () => clearInterval(detectionInterval);
    } catch (error) {
      console.error('摄像头访问错误:', error);
      alert('无法访问摄像头，请确保您已授予权限并使用HTTPS连接');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
      setDetected(false);
      setCurrentProject(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setIsLoggedIn(true);
        setShowLogin(false);
        setUsername('');
        setPassword('');
        router.push('/admin');
      } else {
        setLoginError(data.message || '登录失败');
      }
    } catch (error) {
      setLoginError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    setIsLoggedIn(false);
  };

  const projects = [
    {
      _id: '1',
      name: '佛法AR体验',
      originalImage: '/api/placeholder/300/200',
      videoURL: 'https://example.com/sample-video.mp4',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isClient) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  // 在这里添加你的主组件返回的JSX代码
  return (
    <div className="container">
      <Head>
        <title>AR项目管理系统</title>
        <meta name="description" content="马佛青文化委员会AR项目管理系统" />
      </Head>

      <header>
        <h1>AR项目管理系统</h1>
        {isLoggedIn ? (
          <button onClick={handleLogout}>退出登录</button>
        ) : (
          <button onClick={() => setShowLogin(true)}>管理员登录</button>
        )}
      </header>

      <main>
        {/* 你的主页面内容 */}
      </main>
    </div>
  );
} // ← 这是正确的closing brace，不要删除
