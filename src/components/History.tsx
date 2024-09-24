import React from 'react'
import styled from 'styled-components'

const HistoryContainer = styled.div`
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const HistoryItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const History: React.FC = () => {
  // 这里应该是从某个数据源获取历史记录的逻辑
  const historyItems = [
    { id: 1, content: '历史记录1' },
    { id: 2, content: '历史记录2' },
    { id: 3, content: '历史记录3' },
  ];

  return (
    <HistoryContainer>
      {historyItems.map(item => (
        <HistoryItem key={item.id}>
          {item.content}
        </HistoryItem>
      ))}
    </HistoryContainer>
  )
}

export default History
