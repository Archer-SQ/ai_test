import React, { useState, useEffect } from 'react';
import './App.css';
import AIChat from './components/AIChat';
import Modal from './components/Modal';
import Toolbar from './components/Toolbar';
import History from './components/History';
import styled from 'styled-components';

const BackgroundPattern: React.FC = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
      </pattern>
      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="url(#smallGrid)"/>
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const AnimatedRocket: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="100" height="100" viewBox="0 0 100 100" style={{
    position: 'fixed',
    right: '-20px',
    bottom: '0px',
    zIndex: 1000
  }}>
    <g id="rocket">
      <path d="M50 10 L60 40 L50 35 L40 40 Z" fill="#FF5722" />
      <rect x="45" y="35" width="10" height="30" fill="#FF5722" />
      <path d="M40 65 L50 70 L60 65 L60 75 L50 80 L40 75 Z" fill="#FFA000" />
      <circle cx="50" cy="50" r="5" fill="#FFC107" />
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0; 0 -10; 0 0"
        dur="2s"
        repeatCount="indefinite"
      />
    </g>
    <g id="flames">
      <path d="M45 75 Q50 85 55 75" fill="#FF9800">
        <animate
          attributeName="d"
          values="M45 75 Q50 85 55 75; M45 75 Q50 90 55 75; M45 75 Q50 85 55 75"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
);

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 20px 100px; // 为 PC 端添加更大的水平内边距
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting(); // 初始设置
    const intervalId = setInterval(updateGreeting, 60000); // 每分钟更新一次

    return () => clearInterval(intervalId); // 清理函数
  }, []);

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
    top: '10px',
    left: '10px',
    color: '#333',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '4px 8px',
    borderRadius: '16px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
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
    whiteSpace: 'nowrap', // 防文本换行
  };

  const getToolTitle = (tool: string) => {
    switch (tool) {
      case 'chat':
        return 'AI 对话界面';
      case 'history':
        return '历史记录';
      case 'notifications':
        return '通知消';
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
    fontSize: '2em', // 减小字体大小
  };

  const mobileStyles = `
    @media (max-width: 768px) {
      .App {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .content-container {
        padding-top: 50px !important; // 减小顶部padding
      }
      .tool-content {
        margin-bottom: 70px !important;
      }
      h1 {
        font-size: 1.2em !important; // 将1.5em改为1.2em
        padding: 6px 12px !important; // 稍微减小padding
      }
      .model-name {
        display: none !important;
      }
    }
  `;

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = mobileStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <AppContainer>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}>
        <BackgroundPattern />
      </div>
      {isLoggedIn && <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />}
      <div className="content-container">
        {isLoggedIn ? (
          <>
            <h1 style={h1Style}>{getToolTitle(selectedTool)}</h1>
            <div style={greetingStyle} className="greeting">
              👋 {greeting}，{username}
            </div>
            <div style={topRightStyle}>
              <span className="model-name" style={modelNameStyle}>当前模型：星火大模型-{currentModel}</span>
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
            <AnimatedRocket className="animated-rocket" />
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
    </AppContainer>
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
