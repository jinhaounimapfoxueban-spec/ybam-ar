// 在handleCreate和handleUpdate方法中修改：

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

    // ... 其余代码保持不变
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

    // ... 其余代码保持不变
  } catch (error) {
    console.error('更新项目失败:', error);
    alert('更新失败，请重试');
  } finally {
    setUploading(false);
  }
};
