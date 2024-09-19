import React, { useState, useEffect } from 'react';
import './App.css';
import AIChat from './components/AIChat';
import Modal from './components/Modal';
import Toolbar from './components/Toolbar';
import History from './components/History';

const backgroundImages = [
  'https://images.unsplash.com/photo-1505144808419-1957a94ca61e',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentModel, setCurrentModel] = useState<string>("generalv3.5");
  const [selectedTool, setSelectedTool] = useState<string>("chat");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];
    const timestamp = new Date().getTime();
    const imageWithTimestamp = `${selectedImage}?t=${timestamp}`;
    console.log('Selected background image:', imageWithTimestamp);
    setBackgroundImage(imageWithTimestamp);
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting(); // 初始设置
    const intervalId = setInterval(updateGreeting, 60000); // 每分钟更新一次

    return () => clearInterval(intervalId); // 清理函数
  }, []);

  const appStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px',
    minHeight: '100vh',
    backgroundImage: `url("${backgroundImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingLeft: '60px', /* 为工具栏留出空间 */
  };

  console.log('Current background image:', backgroundImage);

  const logoutButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const h1Style = {
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    marginBottom: '30px',
  };

  const greetingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#ffffff',
    fontSize: '18px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }
    // 这里可以添加更多的验证逻辑，比如密码长度等
    setIsLoggedIn(true);
    setError('');
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const loginButtonStyle: React.CSSProperties = {
    padding: '8px 16px', // 减小内边距
    fontSize: '14px', // 减小字体大小
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const topRightStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // 添加间隔
  };

  const modelNameStyle: React.CSSProperties = {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '14px',
    whiteSpace: 'nowrap', // 防止文本换行
  };

  const getToolTitle = (tool: string) => {
    switch (tool) {
      case 'chat':
        return 'AI 对话界面';
      case 'history':
        return '历史记录';
      case 'notifications':
        return '通知消息';
      case 'balance':
        return '账户余额';
      case 'profile':
        return '个人资料';
      default:
        return 'AI 对话界面';
    }
  };

  const renderToolContent = (tool: string) => {
    switch (tool) {
      case 'chat':
        return <AIChat username={username} setCurrentModel={setCurrentModel} />;
      case 'history':
        return <History />;
      case 'notifications':
        return <div>通知消息内容</div>;
      case 'balance':
        return <div>账户余额内容</div>;
      case 'profile':
        return <div>个人资料内容</div>;
      default:
        return <AIChat username={username} setCurrentModel={setCurrentModel} />;
    }
  };

  const loginTitleStyle: React.CSSProperties = {
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    marginBottom: '30px',
    fontSize: '2.5em',
  };

  return (
    <div className="App" style={appStyle}>
      {isLoggedIn && <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />}
      <div className="content-container">
        {isLoggedIn ? (
          <>
            <h1 style={h1Style}>{getToolTitle(selectedTool)}</h1>
            <div style={greetingStyle}>
              {greeting}，{username}
            </div>
            <div style={topRightStyle}>
              <span style={modelNameStyle}>当前模型：星火大模型-{currentModel}</span>
              <button onClick={handleLogoutClick} style={logoutButtonStyle} title="登出">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="tool-content">
              {renderToolContent(selectedTool)}
            </div>
            <Modal 
              isOpen={isModalOpen} 
              onClose={handleModalClose} 
              onConfirm={handleLogoutConfirm} 
            />
          </>
        ) : (
          <div className="login-container">
            <h1 style={loginTitleStyle}>AI世界</h1>
            <form onSubmit={handleLogin} style={formStyle}>
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              {error && <p style={errorStyle}>{error}</p>}
              <button type="submit" style={loginButtonStyle}>
                登录
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  margin: '5px 0',
};

export default App;
