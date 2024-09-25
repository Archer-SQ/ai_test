import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import AIChat from './AIChat'
import Toolbar from './Toolbar'
import History from './History'
import Notifications from './Notifications'
import AccountBalance from './AccountBalance'
import Profile from './Profile'
import Header from './Header'

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`

const MainContent = styled.div`
    display: flex;
    flex: 1;
    overflow: hidden;
`

const ContentContainer = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    width: calc(100% - 60px);

    @media (max-width: 768px) {
        padding: 10px;
        padding-bottom: 60px;
        width: calc(100% - 40px);
    }
`

const ModuleWrapper = styled.div`
    flex: 1;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`

interface HomeProps {
    setIsLoggedIn: (value: boolean) => void
}

const Home: React.FC<HomeProps> = ({ setIsLoggedIn }) => {
    const [selectedTool, setSelectedTool] = useState('chat') // 设置 'chat' 为默认选中的工具
    const [currentModel, setCurrentModel] = useState('generalv3.5')
    const [moduleTitle, setModuleTitle] = useState('AI 对话')
    const navigate = useNavigate()
    const location = useLocation()
    const username = location.state?.username || '用户'

    const handleLogout = () => {
        setIsLoggedIn(false)
        sessionStorage.removeItem('isLoggedIn')
        navigate('/login')
    }

    useEffect(() => {
        switch (selectedTool) {
            case 'chat':
                setModuleTitle('AI 对话')
                break
            case 'history':
                setModuleTitle('历史记录')
                break
            case 'notifications':
                setModuleTitle('实时热点')
                break
            case 'balance':
                setModuleTitle('实用工具')
                break
            case 'profile':
                setModuleTitle('个人资料')
                break
            default:
                setModuleTitle('AI 对话')
        }
    }, [selectedTool])

    const renderToolContent = () => {
        switch (selectedTool) {
            case 'chat':
                return <AIChat username="用户" setCurrentModel={setCurrentModel} />
            case 'history':
                return <History />
            case 'notifications':
                return <Notifications />
            case 'balance':
                return <AccountBalance />
            case 'profile':
                return <Profile />
            default:
                return <AIChat username="用户" setCurrentModel={setCurrentModel} />
        }
    }

    return (
        <HomeContainer>
            <Header
                username={username}
                avatarUrl={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}
                moduleTitle={moduleTitle}
                modelName={currentModel}
                onLogout={handleLogout}
            />
            <MainContent>
                <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                <ContentContainer>
                    <ModuleWrapper>{renderToolContent()}</ModuleWrapper>
                </ContentContainer>
            </MainContent>
        </HomeContainer>
    )
}

export default Home
