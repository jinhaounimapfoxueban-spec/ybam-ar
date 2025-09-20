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
  const [authToken, setAuthToken] = useState(null); // 新增状态存储token
  const router = useRouter();

  useEffect(() => {
    // 在客户端获取 token
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

  // 其余代码保持不变...
