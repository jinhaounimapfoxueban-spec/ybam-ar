import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    originalImage: '',
    videoURL: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    setAuthToken(token);
    
    if (!token) {
      router.push('/');
      return;
    }
    
    fetchProjects(token);
  }, [router]);

  const fetchProjects = async (token) => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('获取项目失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    router.push('/');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!authToken) return;
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ name: '', originalImage: '', videoURL: '' });
        fetchProjects(authToken);
      }
    } catch (error) {
      console.error('创建项目失败:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个项目吗？') || !authToken) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchProjects(authToken);
      }
    } catch (error) {
      console.error('删除项目失败:', error);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>管理后台 - AR项目管理系统</title>
      </Head>

      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>项目管理后台</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>退出登录</button>
      </header>

      <main style={{ padding: '2rem' }}>
        <button onClick={() => setShowCreateModal(true)} style={{ padding: '10px 20px', marginBottom: '2rem' }}>
          创建新项目
        </button>
        
        {isLoading ? (
          <p>加载中...</p>
        ) : (
          <div>
            {projects.map(project => (
              <div key={project._id} style={{ 
                border: '1px solid #ddd', 
                padding: '1rem', 
                margin: '10px 0',
                borderRadius: '4px'
              }}>
                <h3>{project.name}</h3>
                <p>创建时间: {new Date(project.createdAt).toLocaleDateString()}</p>
                <button onClick={() => handleDelete(project._id)} style={{ padding: '5px 10px' }}>
                  删除
                </button>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <form onSubmit={handleCreate} style={{
              backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px'
            }}>
              <h2>创建新项目</h2>
              <input
                type="text"
                placeholder="项目名称"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ display: 'block', width: '100%', padding: '8px', margin: '10px 0', boxSizing: 'border-box' }}
              />
              <input
                type="url"
                placeholder="原始图片URL"
                value={formData.originalImage}
                onChange={(e) => setFormData({...formData, originalImage: e.target.value})}
                required
                style={{ display: 'block', width: '100%', padding: '8px', margin: '10px 0', boxSizing: 'border-box' }}
              />
              <input
                type="url"
                placeholder="视频URL"
                value={formData.videoURL}
                onChange={(e) => setFormData({...formData, videoURL: e.target.value})}
                required
                style={{ display: 'block', width: '100%', padding: '8px', margin: '10px 0', boxSizing: 'border-box' }}
              />
              <div>
                <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>创建</button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '8px 16px' }}>
                  取消
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
