import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from './Modal'

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 10px;
    }
`

const LeftSection = styled.div`
    display: flex;
    align-items: center;
`

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;

    @media (max-width: 768px) {
        width: 30px;
        height: 30px;
    }
`

const WelcomeText = styled.span`
    font-size: 16px;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`

const RightSection = styled.div`
    display: flex;
    align-items: center;
`

const ModelName = styled.span`
    margin-right: 20px;
    font-size: 14px;
    color: #666;

    @media (max-width: 768px) {
        display: none;
    }
`

const LogoutButton = styled.button`
    background-color: transparent;
    color: #f44336;
    border: 1px solid #f44336;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background-color: #f44336;
        color: white;
    }

    .logout-short-text {
        display: none;
    }

    @media (max-width: 768px) {
        padding: 5px;
        border: 1px solid #f44336;
        background: none;

        .logout-text {
            display: none;
        }

        .logout-short-text {
            display: inline;
        }
    }
`

interface HeaderProps {
    username: string
    avatarUrl: string
    moduleTitle: string
    modelName: string
    onLogout: () => void
}

const Title = styled.h2`
    color: white;
    font-size: 28px;
    font-weight: bold;
    background: unset;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5), -2px -2px 0 rgba(0, 0, 0, 0.5),
        2px -2px 0 rgba(0, 0, 0, 0.5), -2px 2px 0 rgba(0, 0, 0, 0.5);
    margin: 0;
    @media (max-width: 768px) {
        font-size: 20px;
        margin-right: 30px;
    }
`

const Header: React.FC<HeaderProps> = ({
    username,
    avatarUrl,
    moduleTitle,
    modelName,
    onLogout,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogoutClick = () => {
        setIsModalOpen(true)
    }

    const handleConfirmLogout = () => {
        setIsModalOpen(false)
        onLogout()
    }

    return (
        <HeaderContainer>
            <LeftSection>
                <Avatar src={avatarUrl} alt={username} />
                <WelcomeText>欢迎，{username}</WelcomeText>
            </LeftSection>
            <Title>{moduleTitle}</Title>
            <RightSection>
                <ModelName>大模型：{modelName}</ModelName>
                <LogoutButton onClick={handleLogoutClick}>
                    <span className="logout-text">退出登录</span>
                    <span className="logout-short-text">登出</span>
                </LogoutButton>
            </RightSection>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="确认退出"
                message="您确定要退出登录吗？"
            />
        </HeaderContainer>
    )
}

export default Header
