import React from 'react'
import styled from 'styled-components'

const AccountBalanceContainer = styled.div`
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const BalanceCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BalanceTitle = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;

const BalanceAmount = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
`;

const AccountBalance: React.FC = () => {
  return (
    <AccountBalanceContainer>
      <BalanceCard>
        <BalanceTitle>当前余额</BalanceTitle>
        <BalanceAmount>¥ 1000.00</BalanceAmount>
      </BalanceCard>
      <BalanceCard>
        <BalanceTitle>账户信息</BalanceTitle>
        <p>这里是账户余额模块的简单填充内容。</p>
        <p>您可以在这里查看您的账户余额和相关信息。</p>
      </BalanceCard>
    </AccountBalanceContainer>
  )
}

export default AccountBalance
