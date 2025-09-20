import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [detected, setDetected] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      
      // 模拟检测逻辑
      const detectionInterval = setInterval(() => {
        const isDetected = Math.random() > 0.7;
        setDetected(isDetected);
        
        if (isDetected) {
          // 获取项目数据并显示
          fetch('/api/projects')
            .then(res => res.json())
            .then(projects => {
              if (projects.length > 0) {
                setCurrentProject(projects[0]);
              }
            });
        } else {
          setCurrentProject(null);
        }
      }, 2000);
      
      return () => clearInterval(detectionInterval);
    } catch (error) {
      console.error('无法访问摄像头:', error);
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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="container">
      <Head>
        <title>马佛青文化委员会AR项目管理系统</title>
        <meta name="description" content="AR图像识别体验平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <header>
        <div className="logo">
          <i className="fas fa-cube"></i>
          <span>马佛青文化委员会AR项目管理系统</span>
        </div>
      </header>

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
            {!isCameraOpen ? (
              <div className="camera-placeholder">
                <i className="fas fa-camera"></i>
                <p>点击"开启相机"按钮开始扫描</p>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="camera-feed"
                />
                {detected && (
                  <div className="detection-indicator">
                    <div className="detection-dot active"></div>
                    <span>已检测到标记</span>
                  </div>
                )}
              </>
            )}
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
          </div>
          
          {detected && currentProject && (
            <div className="ar-video-overlay">
              <video 
                src={currentProject.videoURL} 
                autoPlay 
                loop 
                controls 
                className="ar-video"
              />
            </div>
          )}
        </div>
      </div>

      <footer>
        <p>© 2025 马佛青文化委员会AR项目管理系统 - 所有权利保留</p>
        <p>技术支持: 马佛青文化委员会TJH</p>
      </footer>

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
        
        .camera-controls {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          gap: 15px;
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
        
        .ar-video-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
          background-color: rgba(0, 0, 0, 0.8);
        }
        
        .ar-video {
          max-width: 90%;
          max-height: 80%;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
          border: 3px solid #fdbb2d;
          border-radius: 10px;
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
    </div>
  );
}
