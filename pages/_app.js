import { useEffect } from 'react';
import { promises as fs } from 'fs';
import path from 'path';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // 在客户端创建上传目录
    const createUploadDir = async () => {
      if (typeof window !== 'undefined') {
        try {
          const response = await fetch('/api/init-upload-dir');
          if (!response.ok) {
            console.warn('无法创建上传目录');
          }
        } catch (error) {
          console.warn('初始化上传目录失败:', error);
        }
      }
    };
    
    createUploadDir();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
