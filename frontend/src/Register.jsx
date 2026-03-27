import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // 直接复用登录界面的样式

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const userRegister = async (e) => {
        e.preventDefault();
        
        // 简单的密码一致性校验
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }

        const userInfo = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('/api/users/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('注册成功:', data);
                alert('注册成功，去登录吧！');
                navigate('/login'); // 注册成功后自动跳转回登录页面
            } else {
                console.error('注册失败，请检查数据或用户名是否已被占用');
            }
        } catch (error) {
            console.error('请求过程中发生错误:', error);
        }
    };

    return (
        <div className="login-viewport">
            <div className="login-container">
                <h1>注册界面</h1>
                
                <form onSubmit={userRegister} className="login-form">
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
                    <input 
                        type="password" 
                        placeholder="再次输入密码" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="login-submit-btn">注册</button>
                </form>

                <div className="login-footer">
                    {/* 点击返回登录页 */}
                    <button type="button" className="register-btn" onClick={() => navigate('/login')}>已有账号？立即登录</button>
                </div>
            </div>
        </div>
    );
};

export default Register;