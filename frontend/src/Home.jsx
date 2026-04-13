import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [msg, setMsg] = useState('Loading...');
  const [username, setUsername] = useState(null); // 用户名
  const [token, setToken] = useState(localStorage.getItem('token') || null); // 从 localStorage 获取 token
  const [showDropdown, setShowDropdown] = useState(false); // 控制下拉菜单显示
  const [projects, setProjects] = useState([
    { id: 1, name: '测试项目1' },
    { id: 2, name: '测试项目2' },
    { id: 3, name: '测试项目3' },
    { id: 4, name: '测试项目4' },
    { id: 5, name: '测试项目5' }
  ]); // 初始创建的5个项目
  const navigate = useNavigate(); // 用于页面跳转

  useEffect(() => {
    fetch('/api/hello/')
      .then((r) => r.json())
      .then((data) => setMsg(data.message))
      .catch(() => setMsg('Could not reach API'));

    // 尝试从 JWT 中解码用户名
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // 解码 JWT payload
        setUsername(payload.username); // 从 payload 中获取用户名 (根据你的 JWT 结构调整)
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setUsername(null);
        setToken(null);
        localStorage.removeItem('token'); // 清除无效 token
      }
    }
  }, []);

  const handleSettings = () => {
    // 暂时为空，方便后续添加设置逻辑
    console.log('Settings clicked');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // 清除 token
    setUsername(null); // 清除用户名状态
    setToken(null); // 清除 token 状态
    navigate('/login'); // 跳转到登录页
  };

  return (
    <div className="home-page">
      <nav className="home-nav">
        {username ? (
          <div
            className="home-user-menu"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button type="button" className="home-button home-user-button">你好，{username}</button>
            {showDropdown && (
              <div className="home-dropdown-menu">
                <div className="home-dropdown-item" onClick={handleSettings}>
                  设置
                </div>
                <div className="home-dropdown-item" onClick={handleLogout}>
                  退出登录
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="home-nav-actions">
            <button type="button" className="home-button" onClick={() => navigate('/login')}>登录</button>
            <button type="button" className="home-button" onClick={() => navigate('/register')}>注册</button>
          </div>
        )}
      </nav>

      <main className="home-main-content">
        <div className="api-status">
          <p>后端 API 状态: <strong>{msg}</strong></p>
        </div>
        
        <div className="project-controls">
          <button className="create-project-btn">创建项目</button>
          <input type="text" className="search-project-input" placeholder="搜索项目" />
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;