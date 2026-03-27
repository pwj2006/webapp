import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [msg, setMsg] = useState('Loading...');
  const [username, setUsername] = useState(null); // 用户名
  const [token, setToken] = useState(localStorage.getItem('token') || null); // 从 localStorage 获取 token
  const [showDropdown, setShowDropdown] = useState(false); // 控制下拉菜单显示
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

  const handleLogout = () => {
    localStorage.removeItem('token'); // 清除 token
    setUsername(null); // 清除用户名状态
    setToken(null); // 清除 token 状态
    navigate('/login'); // 跳转到登录页
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px'
      }}>
        {username ? (
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span style={{ cursor: 'pointer' }}>欢迎，{username}!</span>
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%', // 位于欢迎语下方
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: '120px',
                  padding: '5px 0',
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{ display: 'block', width: '100%', padding: '8px 15px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}
                >退出登录</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>登录</Link>
            <Link to="/register">注册</Link>
          </>
        )}
      </nav>


      <h1>React and Django</h1>
      <p>
        API says: <strong>{msg}</strong>
      </p>
    </div>
  );
}

export default Home;