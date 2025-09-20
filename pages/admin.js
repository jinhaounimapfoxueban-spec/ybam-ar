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
          <div className="projects-list">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                <h3>{project.name}</h3>
                <p>创建时间: {new Date(project.createdAt).toLocaleDateString()}</p>
                <button onClick={() => handleDelete(project._id)}>删除</button>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="modal">
            <form onSubmit={handleCreate}>
              <h2>创建新项目</h2>
              <input
                type="text"
                placeholder="项目名称"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="url"
                placeholder="原始图片URL"
                value={formData.originalImage}
                onChange={(e) => setFormData({...formData, originalImage: e.target.value})}
                required
              />
              <input
                type="url"
                placeholder="视频URL"
                value={formData.videoURL}
                onChange={(e) => setFormData({...formData, videoURL: e.target.value})}
                required
              />
              <button type="submit">创建</button>
              <button type="button" onClick={() => setShowCreateModal(false)}>
                取消
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
} // ← 确保有这个 closing brace
