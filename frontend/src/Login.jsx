import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const userLogin = async (e) => {
        // 阻止表单默认的提交刷新行为
        e.preventDefault();
        
        // 将用户信息打包成 JSON 格式
        const userInfo = {
            username: username,
            password: password
        };

        try {
            // 发送数据到后端 api/users/login/ 地址，触发代理转发到 8000 端口
            const response = await fetch('/api/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            if (response.ok) {
                const data = await response.json();
                alert('登录成功:', data);
                localStorage.setItem('token', data.token); // 保存 token
                navigate('/'); // 跳转到主页

            } else {
                alert('登录失败，请检查账号密码');
            }
        } catch (error) {
            console.error('请求过程中发生错误:', error);
        }
    };

    return (
        <div className="login-viewport">
            <div className="login-container">
                <h1>登录界面</h1>
                
                <form onSubmit={userLogin} className="login-form">
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
                    <button type="submit" className="login-submit-btn">登录</button>
                </form>

                <div className="login-footer">
                    <button type="button" className="register-btn" onClick={() => navigate('/register')}>
                        还没有账号？立即注册
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;