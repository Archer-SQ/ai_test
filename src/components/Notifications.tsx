import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Spin } from 'antd'

interface NewsType {
    typeId: string
    typeName: string
}

interface NewsItem {
    title: string
    newsId: string
    postTime: string
    digest: string
    source: string
}

interface NewsDetail {
    id: string
    items: {
        type: string
        content: string
        imageUrl: string
        videoUrl: string[] | null
    }[]
}

const RealtimeHotspotContainer = styled.div`
    width: 100%;
    max-width: 100%;
    padding: 20px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const TabContainer = styled.div`
    display: flex;
    overflow-x: auto;
    padding: 10px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
`

const Tab = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    margin-right: 8px;
    border: none;
    background-color: ${props => (props.active ? '#007bff' : 'transparent')};
    color: ${props => (props.active ? 'white' : 'black')};
    cursor: pointer;
    white-space: nowrap;
    &:hover {
        background-color: ${props => (props.active ? '#007bff' : '#e0e0e0')};
    }
`

const ContentContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    h3 {
        margin-top: 0;
    }

    /* 隐藏滚动条但保持功能 */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`

const NewsList = styled.ul`
    list-style-type: none;
    padding: 0;
`

const NewsListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 5px;
        background-color: #007bff;
        transform: scaleY(0);
        transition: transform 0.3s ease;
    }

    &:hover::after {
        transform: scaleY(1);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`

const NewsContent = styled.div`
    flex: 1;
`

const NewsTitle = styled.h3`
    margin: 0 0 10px 0;
    font-size: 1.2em;
    color: #333;

    @media (max-width: 768px) {
        font-size: 1em;
    }
`

const NewsTime = styled.span`
    font-size: 0.8em;
    color: #888;
    display: block;
    margin-bottom: 8px;
`

const NewsDigest = styled.p`
    margin: 0;
    font-size: 0.9em;
    color: #555;
    line-height: 1.4;

    @media (max-width: 768px) {
        font-size: 0.8em;
    }
`

const NewsSource = styled.span`
    font-size: 0.8em;
    color: #007bff;
    display: block;
    margin-top: 8px;
`

const NewsDetailContainer = styled.div`
    position: relative;
    height: 100%;
`

const NewsDetailScrollContainer = styled.div`
    height: 100%;
    overflow-y: auto;

    /* 隐藏滚动条但保持功能 */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`

const BackButton = styled.button`
    position: absolute;
    top: -8px;
    left: -8px;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.8);
    }

    &::before {
        content: '←';
        font-size: 16px;
        color: #333;
    }
`

const NewsDetailContent = styled.div`
    padding: 10px;

    @media (max-width: 768px) {
        padding: 5px;
    }
`

const NewsDetailItem = styled.div`
    margin-bottom: 15px;
`

const NewsDetailImage = styled.img`
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px 0;
`

const SpinContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`

const RealtimeHotspot: React.FC = () => {
    const [newsTypes, setNewsTypes] = useState<NewsType[]>([])
    const [selectedType, setSelectedType] = useState<string>('')
    const [news, setNews] = useState<NewsItem[]>([])
    const [selectedNews, setSelectedNews] = useState<NewsDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const APP_ID = 'alpttsrlpmudp3rh'
    const APP_SECRET = 'QL2WxGUmBTRvbv6Q84VaxvQxQa7rlqsz'

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const fetchNews = useCallback(
        async (typeId: string, retryCount = 0): Promise<void> => {
            setLoading(true)
            setError(null)
            try {
                await delay(1000) // 添加1秒延迟
                const response = await axios.get<{ code: number; msg: string; data: NewsItem[] }>(
                    'https://www.mxnzp.com/api/news/list/v2',
                    {
                        params: {
                            typeId: typeId,
                            page: 1,
                            app_id: APP_ID,
                            app_secret: APP_SECRET,
                        },
                    }
                )
                if (response.data.code === 1) {
                    setNews(response.data.data)
                } else {
                    throw new Error(response.data.msg || '获取新闻列表失败')
                }
            } catch (error) {
                console.error('Error fetching news:', error)
                if (
                    error instanceof Error &&
                    error.message.includes('请求频率过快') &&
                    retryCount < 3
                ) {
                    console.log(`Retrying in ${(retryCount + 1) * 2} seconds...`)
                    await delay((retryCount + 1) * 2000)
                    return fetchNews(typeId, retryCount + 1)
                }
                setError('获取新闻列表失败，请稍后重试')
            } finally {
                setLoading(false)
            }
        },
        [APP_ID, APP_SECRET]
    )

    useEffect(() => {
        const fetchNewsTypes = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await axios.get('https://www.mxnzp.com/api/news/types/v2', {
                    params: {
                        app_id: APP_ID,
                        app_secret: APP_SECRET,
                    },
                })
                if (response.data.code === 1 && response.data.data.length > 0) {
                    setNewsTypes(response.data.data)
                    const defaultTypeId = response.data.data[0].typeId
                    setSelectedType(defaultTypeId)
                    fetchNews(defaultTypeId)
                } else {
                    throw new Error(response.data.msg || '获取新闻类型失败')
                }
            } catch (error) {
                console.error('Error fetching news types:', error)
                setError('获取新闻类型失败，请稍后重试')
            } finally {
                setLoading(false)
            }
        }

        fetchNewsTypes()
    }, [fetchNews])

    useEffect(() => {
        if (selectedType) {
            fetchNews(selectedType)
        }
    }, [selectedType, fetchNews])

    const handleTypeChange = (typeId: string) => {
        setSelectedType(typeId)
        setSelectedNews(null)
    }

    const handleNewsClick = async (newsId: string) => {
        setLoading(true)
        try {
            const response = await axios.get('https://www.mxnzp.com/api/news/details/v2', {
                params: {
                    newsId: newsId,
                    app_id: APP_ID,
                    app_secret: APP_SECRET,
                },
            })
            if (response.data.code === 1) {
                setSelectedNews(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching news details:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <RealtimeHotspotContainer>
            <TabContainer>
                {newsTypes.map(type => (
                    <Tab
                        key={type.typeId}
                        active={selectedType === type.typeId}
                        onClick={() => handleTypeChange(type.typeId)}
                    >
                        {type.typeName}
                    </Tab>
                ))}
            </TabContainer>
            <ContentContainer>
                {loading ? (
                    <SpinContainer>
                        <Spin size="large" />
                    </SpinContainer>
                ) : error ? (
                    <div>{error}</div>
                ) : selectedNews ? (
                    <NewsDetailContainer>
                        <BackButton onClick={() => setSelectedNews(null)} />
                        <NewsDetailScrollContainer>
                            <NewsDetailContent>
                                <h3>
                                    {selectedNews.items.find(item => item.type === 'text')?.content}
                                </h3>
                                {selectedNews.items.map((item, index) => (
                                    <NewsDetailItem key={index}>
                                        {item.type === 'text' && <p>{item.content}</p>}
                                        {item.type === 'img' && (
                                            <NewsDetailImage src={item.imageUrl} alt="News" />
                                        )}
                                    </NewsDetailItem>
                                ))}
                            </NewsDetailContent>
                        </NewsDetailScrollContainer>
                    </NewsDetailContainer>
                ) : (
                    <NewsList>
                        {news.map(item => (
                            <NewsListItem
                                key={item.newsId}
                                onClick={() => handleNewsClick(item.newsId)}
                            >
                                <NewsContent>
                                    <NewsTitle>{item.title}</NewsTitle>
                                    <NewsTime>{item.postTime}</NewsTime>
                                    <NewsDigest>{item.digest}</NewsDigest>
                                    <NewsSource>{item.source}</NewsSource>
                                </NewsContent>
                            </NewsListItem>
                        ))}
                    </NewsList>
                )}
            </ContentContainer>
        </RealtimeHotspotContainer>
    )
}

export default RealtimeHotspot
