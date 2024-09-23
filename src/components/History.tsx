import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface HistoryItem {
  role: string;
  content: string;
  timestamp: string;
}

const HistoryContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 75vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 5px;
    margin: 20px -5px 0; // 上边距增加20px，左右保持负边距
    width: calc(100% + 20px);
    border-radius: 0;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const MessageBubble = styled.div<{ role: 'user' | 'assistant' }>`
  background-color: ${props => props.role === 'user' ? '#e3f2fd' : '#f1f8e9'};
  border-radius: 18px;
  padding: 10px 15px;
  max-width: 70%;
  align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
`;

const Content = styled.p`
  color: #333;
  margin: 0;
  text-align: left;
`;

const Timestamp = styled.span`
  color: #7f8c8d;
  font-size: 0.8em;
  margin-top: 5px;
  align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
`;

const Role = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
  align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const NoDataSVG = styled.img`
  width: 400px;  // 将宽度设置为原来的两倍
  height: auto;
  margin-bottom: 20px;
`;

const NoDataText = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
`;

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const storedHistory = sessionStorage.getItem('chatHistory');
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          console.log('Loaded history:', parsedHistory);
          setHistoryItems(parsedHistory);
        } catch (error) {
          console.error('Error parsing chat history:', error);
        }
      }
    };

    loadHistory();

    // 添加事件监听器以检测 sessionStorage 的变化
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'chatHistory' && event.newValue) {
        loadHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '无效日期';
    }
  };

  return (
    <HistoryContainer>
      {historyItems.length > 0 ? (
        historyItems.map((item, index) => (
          <MessageContainer key={index}>
            <Role role={item.role as 'user' | 'assistant'}>
              {item.role === 'user' ? '用户' : 'AI助手'}
            </Role>
            <MessageBubble role={item.role as 'user' | 'assistant'}>
              <Content>{item.content}</Content>
            </MessageBubble>
            <Timestamp role={item.role as 'user' | 'assistant'}>
              {formatTimestamp(item.timestamp)}
            </Timestamp>
          </MessageContainer>
        ))
      ) : (
        <NoDataContainer>
          <NoDataSVG src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" alt="无数据" />
          <NoDataText>暂无聊天记录</NoDataText>
        </NoDataContainer>
      )}
    </HistoryContainer>
  );
};

export default History;
