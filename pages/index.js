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
  const [cameraStatus, setCameraStatus] = useState('点击"开启相机"按钮开始扫描');
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);
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
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('您的浏览器不支持摄像头功能');
        setShowPermissionHelp(true);
        return;
      }

      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isSecure) {
        setCameraStatus('请在HTTPS环境或localhost中访问此页面');
        setShowPermissionHelp(true);
        return;
      }

      setCameraStatus('正在请求摄像头权限...');
      
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
      setCameraStatus('摄像头已开启，请扫描图像');
      setShowPermissionHelp(false);
      
      // 模拟AR标记检测
      detectionIntervalRef.current = setInterval(() => {
        const detectionProbability = 0.7;
        const isDetected = Math.random() > detectionProbability;
        setDetected(isDetected);
        
        if (isDetected && projects.length > 0) {
          setCurrentProject(projects[0]);
        } else {
          setCurrentProject(null);
        }
      }, 2000);
      
    } catch (error) {
      console.error('摄像头访问错误:', error);
      setCameraStatus('无法访问摄像头: ' + error.message);
      setShowPermissionHelp(true);
      
      if (error.name === 'NotAllowedError') {
        setCameraStatus('摄像头权限已被拒绝，请检查浏览器设置');
      } else if (error.name === 'NotFoundError') {
        setCameraStatus('未找到可用的摄像头设备');
      } else if (error.name === 'NotReadableError') {
        setCameraStatus('摄像头设备正被其他应用程序使用');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
      setDetected(false);
      setCurrentProject(null);
      setCameraStatus('摄像头已关闭，点击"开启相机"重新开始');
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
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

  // 模拟项目数据
  const projects = [
    {
      _id: '1',
      name: '佛法AR体验',
      originalImage: '/api/placeholder/300/200',
      videoURL: 'https://example.com/sample-video.mp4',
      createdAt: new Date(),
      status: '已发布'
    }
  ];

  if (!isClient) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>马佛青文化委员会AR项目管理系统</title>
        <meta name="description" content="马佛青文化委员会AR项目管理系统" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
          background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
          min-height: 100vh;
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        
        header {
          background-color: rgba(0, 0, 0, 0.7);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        
        .logo i {
          margin-right: 10px;
          color: #fdbb2d;
        }
        
        .auth-buttons {
          display: flex;
          gap: 15px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background-color: #4e54c8;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #3f43a1;
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background-color: transparent;
          border: 2px solid #4e54c8;
          color: #4e54c8;
        }
        
        .btn-secondary:hover {
          background-color: rgba(78, 84, 200, 0.1);
        }
        
        .btn-danger {
          background-color: #dc3545;
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #bd2130;
          transform: translateY(-2px);
        }
        
        .container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 20px;
          flex: 1;
        }
        
        .hero {
          text-align: center;
          padding: 3rem 0;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 20px;
          margin-bottom: 2rem;
        }
        
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fdbb2d, #b21f1f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero p {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 2rem;
          color: #e1e1e1;
        }
        
        .camera-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }
        
        .camera-frame {
          width: 100%;
          height: 500px;
          background-color: #000;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4px solid #4e54c8;
        }
        
        .camera-placeholder {
          font-size: 5rem;
          color: #4e54c8;
          text-align: center;
          padding: 20px;
        }
        
        .camera-placeholder p {
          margin-top: 20px;
          font-size: 1rem;
        }
        
        .camera-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        
        .scan-line {
          position: absolute;
          width: 100%;
          height: 8px;
          background: linear-gradient(to right, transparent, #fdbb2d, transparent);
          top: 50%;
          animation: scan 2s linear infinite;
          z-index: 5;
        }
        
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        
        .camera-controls {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          gap: 15px;
        }
        
        .ar-video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          pointer-events: none;
        }
        
        .ar-video {
          max-width: 80%;
          max-height: 80%;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
          border: 3px solid #fdbb2d;
          border-radius: 10px;
        }
        
        .detection-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 10px 15px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 15;
        }
        
        .detection-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ff4d4d;
        }
        
        .detection-dot.active {
          background-color: #00ff66;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .marker-outline {
          position: absolute;
          border: 3px solid #00ff66;
          box-shadow: 0 0 15px #00ff66;
          z-index: 8;
          pointer-events: none;
        }
        
        .permission-help {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          padding: 15px;
          margin-top: 20px;
          text-align: left;
        }
        
        .permission-help h3 {
          color: #fdbb2d;
          margin-bottom: 10px;
        }
        
        .permission-help ul {
          text-align: left;
          margin-left: 20px;
        }
        
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .modal-content {
          background: linear-gradient(135deg, #1a2a6c, #3a3f7d);
          width: 90%;
          max-width: 600px;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .close-modal {
          font-size: 1.5rem;
          cursor: pointer;
          color: #fdbb2d;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #fdbb2d;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 2px solid #4e54c8;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
        }
        
        .partner-logo {
          text-align: center;
          margin: 2rem 0;
          padding: 1.5rem;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
        }
        
        .partner-logo img {
          max-width: 300px;
          max-height: 120px;
          margin-bottom: 1rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .partner-logo h3 {
          color: #fdbb2d;
          margin-bottom: 0.5rem;
        }
        
        .partner-logo p {
          color: #e1e1e1;
          font-size: 1rem;
        }
        
        footer {
          text-align: center;
          padding: 2rem;
          background-color: rgba(0, 0, 0, 0.7);
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .camera-frame {
            height: 400px;
          }
          
          .partner-logo img {
            max-width: 250px;
          }
        }
      `}</style>

      <header>
        <div className="logo">
          <i className="fas fa-cube"></i>
          <span>马佛青文化委员会AR项目管理系统</span>
        </div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button className="btn btn-secondary" onClick={handleLogout}>
              <i className="fas fa-user"></i> 登出
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setShowLogin(true)}>
              <i className="fas fa-user-lock"></i> 登入
            </button>
          )}
        </div>
      </header>

      <div className="container">
        <div className="hero">
          <h1>AR图像识别体验平台</h1>
          <p>使用您的手机摄像头扫描特定图像。发现隐藏在图像中的佛法！</p>
          
          <div className="partner-logo">
            <img src="https://ybam-wordpress-media.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2024/05/03162711/ybamlogo2.png" alt="马来西亚佛教青年总会标志" />
            <h3>马来西亚佛教青年总会</h3>
            <p>Young Buddhist Association of Malaysia</p>
          </div>
          
          <div className="camera-container">
            <div className="camera-frame">
              <div className="camera-placeholder" style={{ display: isCameraOpen ? 'none' : 'flex' }}>
                <i className="fas fa-camera"></i>
                <p>{cameraStatus}</p>
              </div>
              <video 
                ref={videoRef} 
                className="camera-feed" 
                autoPlay 
                playsInline 
                style={{ display: isCameraOpen ? 'block' : 'none' }} 
              />
              <div className="scan-line" style={{ display: isCameraOpen ? 'block' : 'none' }} />
              <div className="detection-indicator" style={{ display: isCameraOpen ? 'flex' : 'none' }}>
                <div className={`detection-dot ${detected ? 'active' : ''}`} />
                <span>标记检测</span>
              </div>
              <div 
                className="marker-outline" 
                style={{ 
                  display: detected ? 'block' : 'none',
                  width: '150px',
                  height: '150px',
                  left: '100px',
                  top: '100px'
                }} 
              />
              <div className="ar-video-overlay" style={{ display: detected && currentProject ? 'flex' : 'none' }}>
                {currentProject && (
                  <video 
                    className="ar-video" 
                    src={currentProject.videoURL} 
                    controls 
                    autoPlay 
                    loop 
                    playsInline 
                    style={{ display: detected ? 'block' : 'none' }}
                  />
                )}
              </div>
            </div>
            <div className="camera-controls">
              {!isCameraOpen ? (
                <button className="btn btn-primary" onClick={startCamera}>
                  <i className="fas fa-camera"></i> 开启相机
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={stopCamera}>
                  <i className="fas fa-stop-circle"></i> 关闭相机
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setShowHelpModal(true)}>
                <i className="fas fa-question-circle"></i> 使用说明
              </button>
            </div>
            
            {showPermissionHelp && (
              <div className="permission-help">
                <h3>无法访问摄像头？请尝试以下方法：</h3>
                <ul>
                  <li>确保您使用的是HTTPS连接（安全连接）</li>
                  <li>检查浏览器权限设置，允许此网站使用摄像头</li>
                  <li>如果您使用手机，请尝试使用系统浏览器（Chrome/Safari）</li>
                  <li>确保没有其他应用程序正在使用摄像头</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>管理员登入</h2>
              <span className="close-modal" onClick={() => setShowLogin(false)}>&times;</span>
            </div>
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                placeholder="输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginError && <p style={{ color: 'red', marginBottom: '15px' }}>{loginError}</p>}
            <button 
              className="btn btn-primary" 
              style={{width: '100%'}} 
              onClick={handleLogin}
              disabled={isLoading}
            >
              <i className="fas fa-sign-in-alt"></i> {isLoading ? '登入中...' : '登入'}
            </button>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>使用说明</h2>
              <span className="close-modal" onClick={() => setShowHelpModal(false)}>&times;</span>
            </div>
            <div className="form-group">
              <h3>如何使用AR扫描功能</h3>
              <ol>
                <li>点击"开启相机"按钮允许访问您的摄像头</li>
                <li>将摄像头对准已注册的AR标记图像</li>
                <li>系统会自动识别图像并显示增强现实内容</li>
                <li>您可以移动设备从不同角度查看AR内容</li>
              </ol>
              
              <h3>支持的图像类型</h3>
              <ul>
                <li>手绘彩色图像</li>
                <li>高对比度图案</li>
                <li>包含明显特征的图片</li>
              </ul>
              
              <h3>技术支持</h3>
              <p>如遇到任何问题，请联系技术支持: 马佛青文化委员会TJH</p>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 马佛青文化委员会AR项目管理系统 - 所有权利保留</p>
        <p>技术支持: 马佛青文化委员会TJH</p>
      </footer>
    </div>
  );
}
