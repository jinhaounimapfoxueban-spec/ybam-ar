// 在handleCreate和handleUpdate方法中修改：

const handleCreate = async (e) => {
  e.preventDefault();
  
  if (!authToken) return;
  
  // 提示用户使用外部URL
  const originalImage = prompt('请输入图片URL:');
  const videoURL = prompt('请输入视频URL:');
  
  if (!formData.name || !originalImage || !videoURL) {
    alert('请填写所有字段');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: formData.name,
        originalImage,
        videoURL
      })
    });

    if (response.ok) {
      setShowCreateModal(false);
      setFormData({ name: '', originalImage: null, videoURL: null });
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
    setIsLoading(false);
  }
};
