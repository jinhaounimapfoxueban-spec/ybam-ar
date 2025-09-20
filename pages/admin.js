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
  }; // 这里应该是分号，不是}

  // 在这里添加组件的返回语句
  return (
    <div className="container">
      <Head>
        <title>管理后台 - AR项目管理系统</title>
      </Head>

      <header>
        <h1>项目管理后台</h1>
        <button onClick={handleLogout}>退出登录</button>
      </header>

      <main>
        <button onClick={() => setShowCreateModal(true)}>创建新项目</button>
        
        {isLoading ? (
          <p>加载中...</p>
        ) : (
          <div>
            {projects.map(project => (
              <div key={project._id}>
                <h3>{project.name}</h3>
                <button onClick={() => handleDelete(project._id)}>删除</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} // ← 这是正确的closing brace，不要删除
