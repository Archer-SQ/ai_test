import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface HistoryItem {
  id: string;
  userQuestion: string;
  aiAnswer: string;
  timestamp: string;
}

const HistoryContainer = styled.div`
  width: 100%;
  height: 75vh;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 20px;
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

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const storedHistory = sessionStorage.getItem('chatHistory');
      if (storedHistory) {
        setHistoryItems(JSON.parse(storedHistory));
      }
    };

    loadHistory();
    window.addEventListener('storage', loadHistory);

    return () => {
      window.removeEventListener('storage', loadHistory);
    };
  }, []);

  return (
    <HistoryContainer>
      {historyItems.length > 0 ? (
        historyItems.map((item) => (
          <MessageContainer key={item.id}>
            {item.userQuestion && (
              <MessageBubble role="user">
                <Content>{item.userQuestion}</Content>
              </MessageBubble>
            )}
            {item.aiAnswer && (
              <MessageBubble role="assistant">
                <Content>{item.aiAnswer}</Content>
              </MessageBubble>
            )}
            <Timestamp>{item.timestamp}</Timestamp>
          </MessageContainer>
        ))
      ) : (
        <div>暂无聊天记录</div>
      )}
    </HistoryContainer>
  );
};

export default History;
