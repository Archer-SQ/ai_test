import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, setSelectedTool }) => {
  const tools = [
    { icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', title: '首页', id: 'chat' },
    { icon: 'M3 3h18v18H3V3zm16 16V5H5v14h14zm-5-7v-3h3v3h-3zm0 5v-3h3v5h-5v-2h2zm-9-5v-3h3v3H5zm0 5v-3h3v3H5zm4-3h3v3H9v-3z', title: '历史记录', id: 'history' },
    { icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z', title: '实时热点', id: 'notifications' },
    { icon: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z', title: '账户余额', id: 'balance' },
    { icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', title: '个人资料', id: 'profile' },
  ];

  const handleHomeClick = () => {
    // 处理首页点击事件，例如跳转到主页
    console.log('Home clicked');
    setSelectedTool('chat');
  };

  return (
    <div className="toolbar">
      {tools.map((tool, index) => (
        <div 
          key={index} 
          className={`tool-item ${selectedTool === tool.id ? 'active' : ''}`} 
          title={tool.title}
          onClick={() => setSelectedTool(tool.id)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d={tool.icon} />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
