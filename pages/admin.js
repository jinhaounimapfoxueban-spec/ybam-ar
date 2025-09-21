import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    originalImage: null,
    videoURL: null
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    originalImage: null,
    videoURL: null,
    existingImage: '',
    existingVideo: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = (e, field, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditFormData(prev => ({
          ...prev,
          [field]: file
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: file
        }));
      }

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewId = isEdit ? `edit${field}Preview` : `${field}Preview`;
        const previewElement = document.getElementById(previewId);
        if (previewElement) {
          if (field === 'originalImage') {
            previewElement.innerHTML = `<img src="${e.target.result}" alt="预览" style="max-width:100%; max-height:100%;" />`;
          } else if (field === 'videoURL') {
            previewElement.innerHTML = `
              <video controls style="max-width:100%; max-height:100%;">
                <source src="${e.target.result}" type="${file.type}">
                您的浏览器不支持视频预览
              </video>
            `;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!authToken) return;
    if (!formData.name || !formData.originalImage || !formData.videoURL) {
      alert('请填写所有字段并上传文件');
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('originalImage', formData.originalImage);
      formDataToSend.append('videoURL', formData.videoURL);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ name: '', originalImage: null, videoURL: null });
        // 重置预览
        document.getElementById('originalImagePreview').innerHTML = '<p>原图预览区域</p>';
        document.getElementById('videoURLPreview').innerHTML = '<p>视频预览区域</p>';
        fetchProjects(authToken);
        alert('项目创建成功！');
      } else {
        const error = await response.json();
        alert('创建失败: ' + error.message);
      }
    } catch (error) {
      console.error('创建项目失败:', error);
      alert('创建失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!authToken) return;
    if (!editFormData.name) {
      alert('项目名称不能为空');
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', editFormData.id);
      formDataToSend.append('name', editFormData.name);
      if (editFormData.originalImage) {
        formDataToSend.append('originalImage', editFormData.originalImage);
      }
      if (editFormData.videoURL) {
        formDataToSend.append('videoURL', editFormData.videoURL);
      }

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditFormData({ id: '', name: '', originalImage: null, videoURL: null, existingImage: '', existingVideo: '' });
        fetchProjects(authToken);
        alert('项目更新成功！');
      } else {
        const error = await response.json();
        alert('更新失败: ' + error.message);
      }
    } catch (error) {
      console.error('更新项目失败:', error);
      alert('更新失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个项目吗？此操作不可恢复。') || !authToken) return;

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
        alert('项目删除成功！');
      } else {
        const error = await response.json();
        alert('删除失败: ' + error.message);
      }
    } catch (error) {
      console.error('删除项目失败:', error);
      alert('删除失败，请重试');
    }
  };

  const openEditModal = (project) => {
    setEditFormData({
      id: project._id,
      name: project.name,
      originalImage: null,
      videoURL: null,
      existingImage: project.originalImage,
      existingVideo: project.videoURL
    });
    
    // 设置预览
    setTimeout(() => {
      const editImagePreview = document.getElementById('editOriginalImagePreview');
      const editVideoPreview = document.getElementById('editVideoURLPreview');
      if (editImagePreview) {
        editImagePreview.innerHTML = `<img src="${project.originalImage}" alt="原图预览" style="max-width:100%; max-height:100%;" />`;
      }
      if (editVideoPreview) {
        editVideoPreview.innerHTML = `
          <video controls style="max-width:100%; max-height:100%;">
            <source src="${project.videoURL}" type="video/mp4">
            您的浏览器不支持视频预览
          </video>
        `;
      }
    }, 100);
    
    setShowEditModal(true);
  };

  return (
    <div className="container">
      {/* ... 样式部分保持不变 ... */}
      
      {/* 创建项目模态框 */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>创建新项目</h2>
              <span className="close-modal" onClick={() => setShowCreateModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="projectName">项目名称</label>
                <input
                  type="text"
                  id="projectName"
                  placeholder="输入项目名称"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="originalImage">上传原图（手绘彩色图像）</label>
                <input
                  type="file"
                  id="originalImage"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'originalImage')}
                  required
                />
              </div>
              <div className="preview-container" id="originalImagePreview">
                <p>原图预览区域</p>
              </div>
              <div className="form-group">
                <label htmlFor="videoURL">上传AR视频</label>
                <input
                  type="file"
                  id="videoURL"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'videoURL')}
                  required
                />
              </div>
              <div className="preview-container" id="videoURLPreview">
                <p>视频预览区域</p>
              </div>
              <div className="generate-options">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{width: '100%'}}
                  disabled={uploading}
                >
                  <i className="fas fa-save"></i> 
                  {uploading ? '上传中...' : '保存项目'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑项目模态框 */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>编辑项目</h2>
              <span className="close-modal" onClick={() => setShowEditModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleUpdate}>
              <input type="hidden" value={editFormData.id} />
              <div className="form-group">
                <label htmlFor="editProjectName">项目名称</label>
                <input
                  type="text"
                  id="editProjectName"
                  placeholder="输入项目名称"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editOriginalImage">更新原图（可选）</label>
                <input
                  type="file"
                  id="editOriginalImage"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'originalImage', true)}
                />
              </div>
              <div className="preview-container" id="editOriginalImagePreview">
                <p>原图预览</p>
              </div>
              <div className="form-group">
                <label htmlFor="editVideoURL">更新AR视频（可选）</label>
                <input
                  type="file"
                  id="editVideoURL"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'videoURL', true)}
                />
              </div>
              <div className="preview-container" id="editVideoURLPreview">
                <p>视频预览</p>
              </div>
              <div className="generate-options">
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(editFormData.id)}
                >
                  <i className="fas fa-trash"></i> 删除项目
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  <i className="fas fa-save"></i> 
                  {uploading ? '更新中...' : '更新项目'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
