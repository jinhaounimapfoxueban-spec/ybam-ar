  // 在 if (!isClient) 条件之后添加：
  return (
    <div className="container">
      <Head>
        <title>AR项目管理系统</title>
        <meta name="description" content="马佛青文化委员会AR项目管理系统" />
      </Head>

      <header>
        <h1>AR项目管理系统</h1>
        {isLoggedIn ? (
          <button onClick={handleLogout}>退出登录</button>
        ) : (
          <button onClick={() => setShowLogin(true)}>管理员登录</button>
        )}
      </header>

      <main>
        <div className="camera-section">
          {!isCameraOpen ? (
            <button onClick={startCamera}>启动AR相机</button>
          ) : (
            <div>
              <video ref={videoRef} autoPlay playsInline />
              <button onClick={stopCamera}>关闭相机</button>
              
              {detected && currentProject && (
                <div className="detection-result">
                  <h3>检测到项目: {currentProject.name}</h3>
                  <video src={currentProject.videoURL} controls />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showLogin && (
        <div className="modal">
          <form onSubmit={handleLogin}>
            <h2>管理员登录</h2>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <p className="error">{loginError}</p>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </button>
            <button type="button" onClick={() => setShowLogin(false)}>
              取消
            </button>
          </form>
        </div>
      )}
    </div>
  );
} // ← 确保有这个 closing brace
