import React from 'react'
import styled from 'styled-components'

const AccountBalanceContainer = styled.div`
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #f5f5f5;
`

const AccountBalance: React.FC = () => {
    return <AccountBalanceContainer></AccountBalanceContainer>
}

export default AccountBalance
