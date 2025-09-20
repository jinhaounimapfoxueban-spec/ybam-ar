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
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('authToken');
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ name: '', originalImage: '', videoURL: '' });
        fetchProjects();
      }
    } catch (error) {
      console.error('创建项目失败:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('删除项目失败:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>管理面板 - AR项目管理系统</title>
      </Head>

      <header>
        <div className="logo">
          <i className="fas fa-cog"></i>
          <span>管理面板</span>
        </div>
        <div className="auth-buttons">
          <button className="btn btn-primary" onClick={() => router.push('/')}>
            <i className="fas fa-home"></i> 返回首页
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> 登出
          </button>
        </div>
      </header>

      <div className="admin-panel">
        <div className="admin-header">
          <h2>项目管理</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus"></i> 创建新项目
          </button>
        </div>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project._id} className="project-card">
                <h3>{project.name}</h3>
                <div className="project-image">
                  {project.originalImage ? (
                    <img src={project.originalImage} alt={project.name} />
                  ) : (
                    <i className="fas fa-image"></i>
                  )}
                </div>
                <p>创建时间: {new Date(project.createdAt).toLocaleDateString()}</p>
                <div className="project-actions">
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(project._id)}
                  >
                    <i className="fas fa-trash"></i> 删除
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects">
              <i className="fas fa-inbox"></i>
              <p>暂无项目</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                创建第一个项目
              </button>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>创建新项目</h2>
              <button className="close-modal" onClick={() => setShowCreateModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>项目名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入项目名称"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>原图URL</label>
                <input
                  type="url"
                  value={formData.originalImage}
                  onChange={(e) => setFormData({ ...formData, originalImage: e.target.value })}
                  placeholder="输入原图URL"
                />
              </div>
              
              <div className="form-group">
                <label>视频URL</label>
                <input
                  type="url"
                  value={formData.videoURL}
                  onChange={(e) => setFormData({ ...formData, videoURL: e.target.value })}
                  placeholder="输入视频URL"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i> 创建项目
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-panel {
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 20px;
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .admin-header h2 {
          color: #fdbb2d;
          margin: 0;
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .project-card {
          background: linear-gradient(135deg, #3a3f7d, #1a2a6c);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }
        
        .project-card:hover {
          transform: translateY(-5px);
        }
        
        .project-card h3 {
          color: #fdbb2d;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }
        
        .project-image {
          width: 100%;
          height: 200px;
          background-color: #2c2c2c;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
          overflow: hidden;
        }
        
        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .project-image .fas {
          font-size: 3rem;
          color: #4e54c8;
        }
        
        .project-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .btn-danger {
          background-color: #dc3545;
          color: white;
          border: none;
        }
        
        .btn-danger:hover {
          background-color: #bd2130;
        }
        
        .no-projects {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          border: 2px dashed #4e54c8;
        }
        
        .no-projects .fas {
          font-size: 4rem;
          color: #4e54c8;
          margin-bottom: 1rem;
        }
        
        .no-projects p {
          margin-bottom: 2rem;
          color: #e1e1e1;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 20px;
        }
        
        .fa-spin {
          font-size: 2rem;
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            text-align: center;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
