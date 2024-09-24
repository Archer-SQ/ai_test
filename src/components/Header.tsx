import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
`

const WelcomeText = styled.span`
    font-size: 16px;
`

const RightSection = styled.div`
    display: flex;
    align-items: center;
`

const ModelName = styled.span`
    margin-right: 20px;
    font-size: 14px;
    color: #666;
`

const LogoutButton = styled.button`
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0e0e0;
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
`

const Header: React.FC<HeaderProps> = ({
    username,
    avatarUrl,
    moduleTitle,
    modelName,
    onLogout,
}) => {
    return (
        <HeaderContainer>
            <LeftSection>
                <Avatar src={avatarUrl} alt={username} />
                <WelcomeText>欢迎，{username}</WelcomeText>
            </LeftSection>
            <Title>{moduleTitle}</Title>
            <RightSection>
                <ModelName>{modelName}</ModelName>
                <LogoutButton onClick={onLogout}>登出</LogoutButton>
            </RightSection>
        </HeaderContainer>
    )
}

export default Header
