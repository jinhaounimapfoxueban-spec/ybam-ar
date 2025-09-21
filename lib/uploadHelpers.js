export async function handleFileUpload(file, fieldName, authToken) {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('文件上传失败');
  }
  
  const data = await response.json();
  return data.files[fieldName].url;
}
