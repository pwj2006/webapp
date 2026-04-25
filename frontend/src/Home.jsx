import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [msg, setMsg] = useState('Loading...');
  const [username, setUsername] = useState(null); // 用户名
  const [projects, setProjects] = useState([]); // 项目列表
  const [projectError, setProjectError] = useState(null); // 项目加载错误信息
  const [token, setToken] = useState(localStorage.getItem('token') || null); // 从 localStorage 获取 token
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 用于触发项目列表刷新
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗显示状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'preparing',
    start_date: '',
    end_date: '',
    interview_time: '',
    captain_id: ''
  });
  const navigate = useNavigate(); // 初始化路由跳转 Hook

  useEffect(() => {
    // 显示来自后端 /api/hello 的欢迎信息
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/hello/');
        const data = await response.json();
        setMsg(data.message);
      } catch (error) {
        setMsg('Could not reach API');
      }
    };
    fetchMessage();

    // 尝试从 JWT 中解码用户名
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // 解码 JWT payload
        setUsername(payload.username);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setUsername(null);
        setToken(null);
        localStorage.removeItem('token'); // 清除无效 token
      }
    }
  }, [token]); // 依赖 token，当 token 变化时（登录/登出）重新执行

  // 获取项目列表 (To do: 这个 useEffect 还没人工审核, 有时间记得来看一看)
  useEffect(() => {
    // 如果没有 token (未登录)，则不执行获取操作
    if (!token) return setProjects([]);

    const fetchProjects = async () => {
      setProjectError(null);
      try {
        const response = await fetch('/api/projects/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.code === 200) {
            setProjects(result.data.projects);
          } else if (result.code == 401) {
            setProjectError('登录状态已过期，请重新登录。');
            setToken(null);
            setUsername(null);
            localStorage.removeItem('token'); // 清除过期 token
          } else {
            setProjectError('无法加载项目列表，请检查网络或重新登录。');
          }
        }
      } catch (error) {
        setProjectError('无法加载项目列表，请检查网络或重新登录。');
      }
    };

    fetchProjects();
  }, [token, navigate, refreshTrigger]); // 当 token, navigate 或 refreshTrigger 变化时重新执行
  
  // 渲染导航栏的函数
  const renderNavbar = () => {
    if (username != null) {
      return (
        <div className="home-nav">
          <button className="home-button">
            你好，{username}
            {/* 下拉菜单初始隐藏，鼠标悬浮时展开 */}
            <ul className="home-nav-dropdown-menu">
              <li className="home-nav-dropdown-item">
                  个人中心
              </li>
              <li className="home-nav-dropdown-item" onClick={() => { localStorage.removeItem('token'); setToken(null); setUsername(null); navigate('/login'); }}>
                  退出登录
              </li>
            </ul>
          </button>
        </div>
      );
    }
    return (
      <div className="home-nav">
        <button className="home-button" onClick={() => navigate('/login')}>登录</button>
        <button className="home-button" onClick={() => navigate('/register')}>注册</button>
      </div>
    );
  };

  // 渲染项目管理栏的函数
  const renderProjectManageBar = () => {
    if (!token) return null; // 未登录时不渲染操作栏

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProject = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) return alert('项目名称不能为空');
      try {
        const response = await fetch('/api/projects/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok && data.code === 200) {
          alert('创建成功');
          setRefreshTrigger(prev => prev + 1); // 触发列表自动刷新
          closeModal();
          setFormData({ // 清空表单
            name: '', description: '', location: '', status: 'preparing',
            start_date: '', end_date: '', interview_time: '', captain_id: ''
          }); 
        } else {
          alert(data.msg || '创建失败');
        }
      } catch (err) {
        alert('创建失败，请检查网络');
      }
    };

    return (
      <div className="project-manage-bar">
        <button className="create-project-btn" onClick={openModal}>创建项目</button>
        <input type="text" className="search-project-input" placeholder="搜索项目" />

        {/* 点击创建项目按钮会跳出弹窗 */}
        {isModalOpen && (
        <div className="create-project-modal modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={closeModal}>×</button>
            <h2>创建新项目</h2>
            <form onSubmit={handleCreateProject} className="create-project-form">
              <label>
                项目名称 (必填):
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </label>
              <label>
                项目描述:
                <textarea name="description" value={formData.description} onChange={handleInputChange} />
              </label>
              <label>
                实践地点:
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
              </label>
              <label>
                项目状态:
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="preparing">准备中 (preparing)</option>
                  <option value="ongoing">进行中 (ongoing)</option>
                  <option value="ended">已结束 (ended)</option>
                  <option value="archived">已归档 (archived)</option>
                </select>
              </label>
              <label>
                开始日期:
                <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
              </label>
              <label>
                结束日期:
                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
              </label>
              <label>
                面试时间:
                <input type="date" name="interview_time" value={formData.interview_time} onChange={handleInputChange} />
              </label>
              <label>
                队长用户ID (UUID):
                <input type="text" name="captain_id" value={formData.captain_id} onChange={handleInputChange} placeholder="若指定则自动添加为成员" />
              </label>
              <button type="submit" className="submit-project-btn">提交创建</button>
            </form>
          </div>
        </div>
        )}
      </div>
    );
  };

  // 渲染项目列表的函数
  const renderProjectList = () => {
    // 未登录, 不显示列表
    if (!token) return <div className="project-list-prompt">请先登录以查看项目。</div>;

    // 加载出错, 显示错误信息
    if (projectError) return <div className="project-list-error">加载失败: {projectError}</div>;

    // 成功加载, 渲染项目表格列表
    return (
      <div className="project-list-container">
        <table className="project-list-table">
          <thead>
            <tr>
              <th>项目 ID</th>
              <th>项目名称</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.project_id}>
                <td>{project.project_id}</td>
                {/* 点击项目名称会跳转到项目详情页 */}
                <td>
                  <span 
                    style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
                    onClick={() => navigate(`/projects/${project.project_id}`)}
                  >
                    {project.name}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  //  主页 jsx 代码
  return (
    <div className="home-page">
        {/* 来自后端 API 的欢迎信息*/}
        <h3>{msg}</h3>
        {renderNavbar()}
        {renderProjectManageBar()}
        {renderProjectList()}
    </div>
  );
}

export default Home;