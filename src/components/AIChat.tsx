import React, { useState, useRef, useEffect } from 'react'
import './AIChat.css'
import { generateStreamResponse } from '../services/sparkapi'

interface Message {
    text: string
    isUser: boolean
    avatar: string
}

interface AIChatProps {
    username: string;
    setCurrentModel: React.Dispatch<React.SetStateAction<string>>;
}

const Avatar = React.memo(({ src, alt }: { src: string; alt: string }) => (
    <div className="avatar-container">
        <img src={src} alt={alt} className="avatar" />
    </div>
));

const Message = React.memo(
    ({
        message,
        index,
        onRegenerate,
        onCopy,
        onLike,
        onDislike,
        isStreaming,
    }: {
        message: Message
        index: number
        onRegenerate: (index: number) => void
        onCopy: (text: string, isUser: boolean) => void
        onLike: (index: number) => void
        onDislike: (index: number) => void
        isStreaming?: boolean
    }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [showLikeAnimation, setShowLikeAnimation] = useState(false);
        const [showDislikeAnimation, setShowDislikeAnimation] = useState(false);

        return (
            <div
                className={`message-container ${message.isUser ? 'user' : 'ai'} ${
                    isStreaming ? 'streaming' : ''
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {!message.isUser && <Avatar src={message.avatar} alt="AI avatar" />}
                <div className="message-wrapper">
                    <div className="message">{message.text}</div>
                    {isHovered && !isStreaming && (
                        <div className="message-actions">
                            <button onClick={() => onCopy(message.text, message.isUser)} title="复制">
                                📋
                            </button>
                            {!message.isUser && (
                                <>
                                    <button onClick={() => onRegenerate(index)} title="重新生成">
                                        🔄
                                    </button>
                                    <button onClick={() => {
                                        setShowLikeAnimation(true);
                                        setTimeout(() => setShowLikeAnimation(false), 1000);
                                        onLike(index);
                                    }} title="点赞">
                                        👍
                                    </button>
                                    <button onClick={() => {
                                        setShowDislikeAnimation(true);
                                        setTimeout(() => setShowDislikeAnimation(false), 1000);
                                        onDislike(index);
                                    }} title="点踩">
                                        👎
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    {showLikeAnimation && <span className="like-animation">+1</span>}
                    {showDislikeAnimation && <span className="dislike-animation">-1</span>}
                </div>
                {message.isUser && <Avatar src={message.avatar} alt="User avatar" />}
            </div>
        );
    },
    (prevProps, nextProps) =>
        prevProps.message === nextProps.message &&
        prevProps.isStreaming === nextProps.isStreaming
);

const LoadingDots = () => (
    <div className="loading-dots-container">
        <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    </div>
);

interface HistoryItem {
  id: string;
  userQuestion: string;
  aiAnswer: string;
  timestamp: string;
}

const AIChat: React.FC<AIChatProps> = ({ username, setCurrentModel }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const chatHistoryRef = useRef<HTMLDivElement>(null)
    const [userAvatar, setUserAvatar] = useState('')
    const [aiAvatar, setAiAvatar] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const MAX_CHARS = 200
    const [lastUserMessage, setLastUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setUserAvatar(`https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`)
        setAiAvatar(`https://api.dicebear.com/6.x/bottts/svg?seed=${Math.random()}`)
    }, [])

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
        }
    }, [messages])

    const scrollToBottom = () => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // 组件加载时，从 sessionStorage 读取历史记录
        const storedHistory = sessionStorage.getItem('chatHistory');
        if (storedHistory) {
            setChatHistory(JSON.parse(storedHistory));
        }
    }, []);

    const handleSendMessage = async () => {
        if (isStreaming || !input.trim()) return;

        const userMessage: Message = {
            text: input,
            isUser: true,
            avatar: userAvatar,
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        const currentInput = input.trim();
        setInput('');
        setIsStreaming(true);

        try {
            const aiMessage: Message = {
                text: '',
                isUser: false,
                avatar: aiAvatar,
            };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
            
            let fullResponse = '';
            for await (const char of generateStreamResponse(currentInput)) {
                fullResponse += char;
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        text: fullResponse,
                    };
                    return newMessages;
                });
                // 添加一个小延迟，让React有时间更新状态
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            if (fullResponse.trim() === '') {
                throw new Error('未收到响应');
            }

            // 对话完成后，保存完整的对话到历史记录
            saveToHistory(currentInput, fullResponse.trim());

        } catch (error) {
            console.error('生成响应时出错:', error);
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    text: '发生错误，请稍后再试。',
                };
                return newMessages;
            });
        } finally {
            setIsStreaming(false);
        }
    };

    const saveToHistory = (userQuestion: string, aiAnswer: string) => {
        if (userQuestion && aiAnswer) {
            const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                userQuestion,
                aiAnswer,
                timestamp: new Date().toLocaleString()
            };

            const storedHistory = sessionStorage.getItem('chatHistory');
            const chatHistory = storedHistory ? JSON.parse(storedHistory) : [];
            const updatedHistory = [...chatHistory, newHistoryItem];
            sessionStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        console.log('Input changed:', text) // 添加这行
        if (text.length <= MAX_CHARS) {
            setInput(text)
        }
    }

    const clearInput = () => {
        setInput('')
    }

    const handleRegenerate = async () => {
        if (!lastUserMessage) return;

        setIsStreaming(true);

        try {
            const aiMessage: Message = {
                text: '',
                isUser: false,
                avatar: aiAvatar,
            };
            setMessages(prevMessages => [...prevMessages, aiMessage]);

            let fullResponse = '';
            for await (const chunk of generateStreamResponse(lastUserMessage)) {
                fullResponse += chunk;
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        text: fullResponse,
                    };
                    return newMessages;
                });
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            if (fullResponse.trim() === '') {
                throw new Error('No response received');
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    text: '发生错误，请稍后再试。',
                };
                return newMessages;
            });
        } finally {
            setIsStreaming(false);
        }
    };

    const handleCopy = (text: string, isUser: boolean) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('文本已复制到剪贴板');
            if (isUser) {
                setInput(text);
            }
        });
    };

    const handleLike = (messageIndex: number) => {
        console.log('赞消息:', messageIndex);
        // 这里可以添加实际的点赞逻辑
    };

    const handleDislike = (messageIndex: number) => {
        console.log('点踩消息:', messageIndex);
        // 这里可以添加实际的点踩逻辑
    };

    useEffect(() => {
        setCurrentModel("generalv3.5");
    }, [setCurrentModel]);

    return (
        <div className="chat-container">
            <div className="chat-history" ref={chatHistoryRef}>
                {messages.map((message, index) => (
                    <Message 
                        key={index} 
                        message={message} 
                        index={index}
                        onRegenerate={handleRegenerate}
                        onCopy={handleCopy}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        isStreaming={index === messages.length - 1 && isStreaming}
                    />
                ))}
            </div>
            {isStreaming && <LoadingDots />}
            <div className="input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isStreaming) {
                                handleSendMessage();
                            }
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="输入消息..."
                        maxLength={MAX_CHARS}
                        disabled={isStreaming}
                    />
                    {input && (
                        <div className="input-suffix">
                            <svg className="clear-icon" viewBox="0 0 24 24" onClick={clearInput}>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </div>
                    )}
                    {isFocused && (
                        <span className="char-count">
                            {input.length}/{MAX_CHARS}
                        </span>
                    )}
                </div>
                <button 
                    onClick={handleSendMessage} 
                    className="send-button" 
                    disabled={isStreaming}
                    style={{ opacity: isStreaming ? 0.5 : 1, cursor: isStreaming ? 'not-allowed' : 'pointer' }}
                >
                    发送
                </button>
            </div>
        </div>
    )
}

export default AIChat
