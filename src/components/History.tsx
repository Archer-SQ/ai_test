import React from 'react'
import styled from 'styled-components'

const HistoryContainer = styled.div`
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #f5f5f5;
`

const HistoryItem = styled.div`
    display: flex;
    justify-content: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
    align-items: flex-start;
    margin-bottom: 15px;
`

const MessageBubble = styled.div`
    background-color: ${({ role }) => (role === 'user' ? '#d1e7dd' : '#ffffff')};
    border-radius: 8px;
    padding: 15px;
    max-width: 60%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 0 10px;
`

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`

const Timestamp = styled.div`
    font-size: 12px;
    color: #888;
    margin-top: 5px;
    text-align: ${({ role }) => (role === 'user' ? 'right' : 'left')};
`

const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', { hour12: false })
}

const EmptyHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
`

const EmptyHistorySVG = styled.svg`
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
`

const EmptyHistoryText = styled.p`
    font-size: 18px;
    text-align: center;
`

const History: React.FC = () => {
    const chatHistory: { role: string; content: string; timestamp: string }[] = JSON.parse(
        sessionStorage.getItem('chatHistory') || '[]'
    )

    // 预处理聊天历史，只保留每个时间戳（精确到秒）的第一条消息
    const uniqueHistory = chatHistory.reduce((acc, current) => {
        const currentSeconds = new Date(current.timestamp).setMilliseconds(0)
        if (!acc.find(item => new Date(item.timestamp).setMilliseconds(0) === currentSeconds)) {
            acc.push(current)
        }
        return acc
    }, [] as typeof chatHistory)

    return (
        <HistoryContainer>
            {uniqueHistory.length > 0 ? (
                uniqueHistory.map((message, index) => (
                    <HistoryItem key={index} role={message.role}>
                        {message.role === 'assistant' && (
                            <Avatar
                                src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z"/></svg>`}
                                alt="Assistant Avatar"
                            />
                        )}
                        <MessageBubble role={message.role}>
                            {message.content}
                            <Timestamp role={message.role}>
                                {formatDate(message.timestamp)}
                            </Timestamp>
                        </MessageBubble>
                        {message.role === 'user' && (
                            <Avatar
                                src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}
                                alt="User Avatar"
                            />
                        )}
                    </HistoryItem>
                ))
            ) : (
                <EmptyHistoryContainer>
                    <EmptyHistorySVG
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 8V12L15 15"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="9" stroke="#888" strokeWidth="2" />
                    </EmptyHistorySVG>
                    <EmptyHistoryText>暂无历史记录</EmptyHistoryText>
                </EmptyHistoryContainer>
            )}
        </HistoryContainer>
    )
}

export default History
