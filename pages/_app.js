import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // 在客户端初始化上传目录
    const initUploadDir = async () => {
      try {
        await fetch('/api/init-upload-dir');
      } catch (error) {
        console.warn('初始化上传目录失败:', error);
      }
    };
    
    initUploadDir();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
