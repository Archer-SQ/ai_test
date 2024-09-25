import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

const ToolbarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  left: ${props => props.isVisible ? '0' : '-60px'};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 0 10px 10px 0;
  z-index: 1000;
  transition: left 0.3s ease-in-out;

  @media (max-width: 768px) {
    left: 0;
    top: auto;
    bottom: 0;
    transform: none;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    border-radius: 10px 10px 0 0;
  }
`;

const ToolItem = styled.div<{ isSelected: boolean }>`
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  svg {
    fill: ${props => props.isSelected ? '#4CAF50' : 'white'};
    transition: fill 0.3s ease;
  }

  &:hover svg {
    fill: #4CAF50;
  }

  @media (max-width: 768px) {
    margin: 0 10px;

    &:hover::after {
      display: none;
    }
  }
`;

interface ToolbarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, setSelectedTool }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 10) {
        setIsVisible(true);
      } else if (e.clientX > 70) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  const tools = [
    { icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', title: 'AI 对话', id: 'chat' },
    { icon: 'M3 3h18v18H3V3zm16 16V5H5v14h14zm-5-7v-3h3v3h-3zm0 5v-3h3v5h-5v-2h2zm-9-5v-3h3v3H5zm0 5v-3h3v3H5zm4-3h3v3H9v-3z', title: '历史记录', id: 'history' },
    { icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z', title: '实时热点', id: 'notifications' },
    { icon: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z', title: '实用工具', id: 'balance' },
    { icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', title: '个人资料', id: 'profile' },
  ];

  return (
    <ToolbarContainer isVisible={isVisible || isMobile}>
      {tools.map((tool, index) => (
        <Tooltip 
          key={index}
          title={tool.title}
          placement="right"
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0.1}
        >
          <ToolItem 
            onClick={() => setSelectedTool(tool.id)}
            isSelected={selectedTool === tool.id}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d={tool.icon} />
            </svg>
          </ToolItem>
        </Tooltip>
      ))}
    </ToolbarContainer>
  );
};

export default Toolbar;
