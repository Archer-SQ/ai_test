import React, { useState, useRef, useEffect } from 'react'
import './AIChat.css'
import { generateStreamResponse } from '../services/sparkapi'
import { Spin } from 'antd'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
    text: string
    isUser: boolean
    avatar: string
}

interface AIChatProps {
    username: string
    setCurrentModel: React.Dispatch<React.SetStateAction<string>>
}

const Avatar = React.memo(({ src, alt }: { src: string; alt: string }) => (
    <div className="avatar-container">
        <img src={src} alt={alt} className="avatar" />
    </div>
))

const ThinkingIcon = styled.div`
    position: absolute;
    top: -25px;
    left: 43%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    animation: blink 1s infinite alternate;

    @keyframes blink {
        0% {
            opacity: 0.3;
        }
        100% {
            opacity: 1;
        }
    }
`

const CodeBlock = styled.div`
    position: relative;
    margin: 1em 0;
`

const CopyButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background: #444;
    color: #fff;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 12px;
    cursor: pointer;
    &:hover {
        background: #555;
    }
`

const Message = React.memo(
    ({
        message,
        index,
        onRegenerate,
        onCopy,
        onLike,
        onDislike,
        isStreaming,
        isLastAIMessage,
    }: {
        message: Message
        index: number
        onRegenerate: (index: number) => void
        onCopy: (text: string, isUser: boolean) => void
        onLike: (index: number) => void
        onDislike: (index: number) => void
        isStreaming: boolean
        isLastAIMessage: boolean
    }) => {
        const [isHovered, setIsHovered] = useState(false)
        const [showLikeAnimation, setShowLikeAnimation] = useState(false)
        const [showDislikeAnimation, setShowDislikeAnimation] = useState(false)
        const [showSpin, setShowSpin] = useState(
            isStreaming && isLastAIMessage && message.text.length === 0
        )

        useEffect(() => {
            if (isStreaming && isLastAIMessage && message.text.length > 0) {
                setShowSpin(false)
            }
        }, [isStreaming, isLastAIMessage, message.text])

        const copyCode = (code: string) => {
            navigator.clipboard.writeText(code)
            // 可以添加一个提示，表示代码已复制
        }

        const renderers = {
            code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                    <CodeBlock>
                        <CopyButton onClick={() => copyCode(String(children))}>复制</CopyButton>
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    </CodeBlock>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                )
            },
        }

        return (
            <div
                className={`message-container ${message.isUser ? 'user' : 'ai'} ${
                    isStreaming ? 'streaming' : ''
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {!message.isUser && (
                    <div style={{ position: 'relative' }}>
                        <Avatar src={message.avatar} alt="AI头像" />
                        {isStreaming && isLastAIMessage && (
                            <ThinkingIcon>
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <text x="4" y="20" fontSize="12" fill="red">
                                        ?
                                    </text>
                                    <text x="8" y="20" fontSize="12" fill="red">
                                        ?
                                    </text>
                                    <text x="12" y="20" fontSize="12" fill="red">
                                        ?
                                    </text>
                                </svg>
                            </ThinkingIcon>
                        )}
                    </div>
                )}
                <div className="message-wrapper">
                    <div className="message">
                        {showSpin ? (
                            <Spin size="small" />
                        ) : (
                            <ReactMarkdown components={renderers}>{message.text}</ReactMarkdown>
                        )}
                    </div>
                    {isHovered && !isStreaming && (
                        <div className="message-actions">
                            {message.isUser ? (
                                <button
                                    onClick={() => onCopy(message.text, message.isUser)}
                                    title="复制"
                                >
                                    📋
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onCopy(message.text, message.isUser)}
                                        title="复制"
                                    >
                                        📋
                                    </button>
                                    {isLastAIMessage && (
                                        <button
                                            onClick={() => onRegenerate(index)}
                                            title="重新生成"
                                        >
                                            🔄
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setShowLikeAnimation(true)
                                            setTimeout(() => setShowLikeAnimation(false), 1000)
                                            onLike(index)
                                        }}
                                        title="点赞"
                                    >
                                        👍
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDislikeAnimation(true)
                                            setTimeout(() => setShowDislikeAnimation(false), 1000)
                                            onDislike(index)
                                        }}
                                        title="点踩"
                                    >
                                        👎
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    {showLikeAnimation && <span className="like-animation">+1</span>}
                    {showDislikeAnimation && <span className="dislike-animation">-1</span>}
                </div>
                {message.isUser && <Avatar src={message.avatar} alt="用户头像" />}
            </div>
        )
    },
    (prevProps, nextProps) =>
        prevProps.message === nextProps.message &&
        prevProps.isStreaming === nextProps.isStreaming &&
        prevProps.isLastAIMessage === nextProps.isLastAIMessage
)

const LoadingDots = () => (
    <div className="loading-dots-container">
        <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    </div>
)

interface HistoryItem {
    id: string
    userQuestion: string
    aiAnswer: string
    timestamp: string
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
    const [lastUserMessage, setLastUserMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([])

    useEffect(() => {
        setUserAvatar(
            `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
        )
        setAiAvatar(
            `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z"/></svg>`
        )
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
        const storedHistory = sessionStorage.getItem('chatHistory')
        if (storedHistory) {
            setChatHistory(JSON.parse(storedHistory))
        }
    }, [])

    const handleSendMessage = async () => {
        if (input.trim() === '' || isStreaming) return

        const userMessage = { role: 'user', content: input }
        const newMessages = [...messages, { text: input, isUser: true, avatar: userAvatar }]
        setMessages(newMessages)
        setInput('')
        setLastUserMessage(input)

        const newHistory = [...chatHistory, userMessage]
        setChatHistory(newHistory)

        setIsStreaming(true)
        let fullResponse = ''

        try {
            const stream = generateStreamResponse(input, chatHistory)

            // 添加一个新的空白AI消息
            setMessages(prevMessages => [
                ...prevMessages,
                { text: '', isUser: false, avatar: aiAvatar },
            ])

            for await (const chunk of stream) {
                fullResponse += chunk
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages]
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        text: fullResponse,
                    }
                    return newMessages
                })
                await new Promise(resolve => setTimeout(resolve, 10))
            }

            if (fullResponse.trim() === '') {
                throw new Error('未收到响应')
            }

            setChatHistory(prev => [...prev, { role: 'assistant', content: fullResponse }])
        } catch (error) {
            console.error('生成响应时出错:', error)
            setMessages(prevMessages => {
                const newMessages = [...prevMessages]
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    text: `发生错误：${
                        (error as Error).message || '未知错误'
                    }，请稍后再试。如果问题持，请联系支持团队。`,
                }
                return newMessages
            })
        } finally {
            setIsStreaming(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        if (text.length <= MAX_CHARS) {
            setInput(text)
        }
    }

    const clearInput = () => {
        setInput('')
    }

    const handleRegenerate = async () => {
        if (!lastUserMessage || isStreaming) return

        setIsStreaming(true)

        try {
            const aiMessage: Message = {
                text: '',
                isUser: false,
                avatar: aiAvatar,
            }
            setMessages(prevMessages => [...prevMessages, aiMessage])

            let fullResponse = ''
            for await (const chunk of generateStreamResponse(lastUserMessage, chatHistory)) {
                fullResponse += chunk
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages]
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        text: fullResponse,
                    }
                    return newMessages
                })
                await new Promise(resolve => setTimeout(resolve, 10))
            }

            if (fullResponse.trim() === '') {
                throw new Error('未收到响应')
            }

            setChatHistory(prev => [...prev, { role: 'assistant', content: fullResponse }])
        } catch (error) {
            console.error('生成响应时出错:', error)
            setMessages(prevMessages => {
                const newMessages = [...prevMessages]
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    text: `发生错误：${(error as Error).message || '未知错误'}，请稍后再试。`,
                }
                return newMessages
            })
        } finally {
            setIsStreaming(false)
        }
    }

    const handleCopy = (text: string, isUser: boolean) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('文本已复制到剪贴板')
            if (isUser) {
                setInput(text)
            }
        })
    }

    const handleLike = (messageIndex: number) => {
        console.log('赞消息:', messageIndex)
        // 这里可以添加实际的点赞逻辑
    }

    const handleDislike = (messageIndex: number) => {
        console.log('点踩消息:', messageIndex)
        // 这里可以添加实际的点踩逻辑
    }

    useEffect(() => {
        setCurrentModel('generalv3.5')
    }, [setCurrentModel])

    const lastAIMessageIndex = messages.reduceRight((acc, message, index) => {
        if (acc === -1 && !message.isUser) {
            return index
        }
        return acc
    }, -1)

    return (
        <div className="chat-container">
            <div className="chat-history" ref={chatHistoryRef}>
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        message={message}
                        index={index}
                        onRegenerate={handleRegenerate}
                        onCopy={(text, isUser) => handleCopy(text, isUser)}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        isStreaming={index === lastAIMessageIndex && isStreaming}
                        isLastAIMessage={index === lastAIMessageIndex}
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
                        onKeyPress={e => {
                            if (e.key === 'Enter' && !isStreaming) {
                                handleSendMessage()
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
                    style={{
                        opacity: isStreaming ? 0.5 : 1,
                        cursor: isStreaming ? 'not-allowed' : 'pointer',
                    }}
                >
                    发送
                </button>
            </div>
        </div>
    )
}

export default AIChat
