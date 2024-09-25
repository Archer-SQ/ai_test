import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaSearch } from 'react-icons/fa'

const UtilityPanelContainer = styled.div`
    display: flex;
    height: 100%;
    background-color: #f8f9fa;
`

const Sidebar = styled.div`
    width: 250px;
    background-color: #ffffff;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        width: 160px;
    }
`

const SearchContainer = styled.div`
    padding: 15px;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 1;
    border-bottom: 1px solid #e0e0e0;
`

const SearchInputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

const SearchInput = styled.input`
    width: 100%;
    padding: 10px 15px 10px 35px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    transition: all 0.3s;

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`

const SearchIcon = styled(FaSearch)`
    position: absolute;
    left: 12px;
    color: #aaa;
`

const ToolList = styled.div`
    overflow-y: auto;
    flex-grow: 1;
    padding: 15px;
`

const ToolCard = styled.div<{ active: boolean }>`
    padding: 12px 15px;
    margin-bottom: 10px;
    background-color: ${props => (props.active ? '#e8f0fe' : '#ffffff')};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid ${props => (props.active ? '#4285f4' : 'transparent')};

    &:hover {
        background-color: ${props => (props.active ? '#d0e1fd' : '#f8f9fa')};
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
`

const ToolName = styled.h3`
    margin: 0;
    font-size: 16px;
    color: #333;
`

const ToolContent = styled.div`
    flex-grow: 1;
    padding: 30px;
    overflow-y: auto;
    background-color: #ffffff;
`

const tools = [
    { id: 'tool1', name: '工具1' },
    { id: 'tool2', name: '工具2' },
    { id: 'tool3', name: '工具3' },
    // 添加更多工具...
]

const UtilityPanel: React.FC = () => {
    const [activeTool, setActiveTool] = useState(tools[0].id)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredTools, setFilteredTools] = useState(tools)

    useEffect(() => {
        const filtered = tools.filter(tool =>
            tool.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredTools(filtered)
    }, [searchTerm])

    const renderToolContent = (toolId: string) => {
        switch (toolId) {
            case 'tool1':
                return <h2>工具1的内容</h2>
            case 'tool2':
                return <h2>工具2的内容</h2>
            case 'tool3':
                return <h2>工具3的内容</h2>
            default:
                return <h2>请选择一个工具</h2>
        }
    }

    return (
        <UtilityPanelContainer>
            <Sidebar>
                <SearchContainer>
                    <SearchInputWrapper>
                        <SearchIcon />
                        <SearchInput
                            type="text"
                            placeholder="搜索工具..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </SearchInputWrapper>
                </SearchContainer>
                <ToolList>
                    {filteredTools.map(tool => (
                        <ToolCard
                            key={tool.id}
                            active={activeTool === tool.id}
                            onClick={() => setActiveTool(tool.id)}
                        >
                            <ToolName>{tool.name}</ToolName>
                        </ToolCard>
                    ))}
                </ToolList>
            </Sidebar>
            <ToolContent>{renderToolContent(activeTool)}</ToolContent>
        </UtilityPanelContainer>
    )
}

export default UtilityPanel
