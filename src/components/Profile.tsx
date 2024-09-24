import React from 'react'
import styled from 'styled-components'

const ProfileContainer = styled.div`
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const ProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileTitle = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;

const ProfileInfo = styled.p`
  margin-bottom: 10px;
`;

const Profile: React.FC = () => {
  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileTitle>个人资料</ProfileTitle>
        <ProfileInfo>用户名：示例用户</ProfileInfo>
        <ProfileInfo>邮箱：example@example.com</ProfileInfo>
        <ProfileInfo>注册时间：2023-05-01</ProfileInfo>
      </ProfileCard>
      <ProfileCard>
        <ProfileTitle>其他信息</ProfileTitle>
        <p>这里是个人资料模块的简单填充内容。</p>
        <p>您可以在这里查看和编辑您的个人信息。</p>
      </ProfileCard>
    </ProfileContainer>
  )
}

export default Profile
