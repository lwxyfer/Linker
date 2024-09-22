import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    FolderOutlined,
    FolderFilled,
    QuestionCircleOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Tree, Tooltip } from 'antd';
import { DataContext, DataContextInterface } from '../Context'
import logoImg from '@/public/icon/128.png'
import { getCurrentI18n } from '@/entrypoints/common/i18n/language';


import './style.css'

type MenuItem = Required<MenuProps>['items'][number];

// Function to convert Chrome bookmarks data to Menu component data structure
function convertToMenuData(bookmarksData) {
    return bookmarksData.map(folder => ({
        key: folder.id,
        label: folder.title,
        icon: <FolderOutlined />,
        children: folder.children?.length > 0 ? convertToMenuData(folder.children) : undefined,
    }));
}

const list2Tree = (bookmarks) => {
    const rootBookmarks = bookmarks.filter(bookmark => !bookmark.parentId || bookmark.parentId === '0');
    const populateChildren = (bookmark: Bookmark): Bookmark => {
        bookmark.children = bookmarks.filter(child => child.parentId === bookmark.id && !child.url);

        if (bookmark.children.length > 0) {
            bookmark.children.map(populateChildren);
        }

        return bookmark;
    };
    return rootBookmarks.map(populateChildren);
}

const getOnlyFolders = (nodes) => {
    return nodes && nodes?.filter((item) => !item.url)
}

const renderTreeNodes = (data) =>
    data.map((node) => {
        if (getOnlyFolders(node.children)?.length > 0) {
            return {
                title: node.title,
                key: node.id,
                children: renderTreeNodes(getOnlyFolders(node.children)),
                icon: <FolderFilled style={{ fontSize: 16,}} />
            };
        }
        return {
            title: node.title,
            key: node.id,
            icon: <FolderFilled style={{ fontSize: 16, }} />
        };
    });


function getRandomColor() {
    // Generate a random color in hexadecimal format
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 40; // 40-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


const Side: React.FC = () => {
    const { list, onActiveIdChange, onTagChange, activeTag, activeId } = React.useContext<DataContextInterface>(DataContext) ?? { list: [] };
    const tree = list2Tree(list);
    const treeData = renderTreeNodes(tree);
    const [activeType, setActiveType] = React.useState<'node' | 'tag'>('node');
    const [expandedKeys, setExpandedKeys] = React.useState<string[]>(undefined);

    const getAllTags = (): string[] => {
        const tags = [...new Set(list.flatMap((item) => item?.tags ?? []))];
        return tags;
    }

    const tags = getAllTags();

    const handleMenuClick = (selectedKeys: React.Key[], info: any) => {
        onActiveIdChange?.(selectedKeys[0]);
        onTagChange('');
        setActiveType('node');
    };

    const handleTagClick = (tag: string) => {
        onTagChange(tag);
        onActiveIdChange('');
        setActiveType('tag');
    }

    const handleExpand = (expandedKeys) => {
        console.log('expandedKeys', expandedKeys)
        setExpandedKeys(expandedKeys);
    }

    const defaultExpandedKeys = treeData.map((item) => item.key);


    return (
        <div className='side'>
            <div className="side-logo">
                <img src={logoImg} style={{ width: '36px', height: '36px', padding: 6 }} />
                <h3 style={{ color: '#FF6500'}}>Linker</h3>
            </div>
            <h4 className='side-tag-title'>{ getCurrentI18n('Catalog') }</h4>
            <div style={{ paddingLeft: 12, paddingRight: 6 }}>
                <Tree
                    showIcon
                    treeData={treeData}
                    onSelect={handleMenuClick}
                    defaultSelectedKeys={['0-0-0']}
                    selectedKeys={[activeId]}
                    blockNode
                    onExpand={handleExpand}
                    expandedKeys={expandedKeys || defaultExpandedKeys}
                />
            </div>
            <div className='side-tag'>
                <h4 className='side-tag-title'>{getCurrentI18n('Tags')} <Tooltip title={getCurrentI18n('TagTip')}>
                    <QuestionCircleOutlined /></Tooltip></h4>
                {
                    tags?.map((tag) => {
                        return (
                            <div key={tag} className={`side-tag-item ${activeType === 'tag' && tag === activeTag ? 'side-tag-item-active' : ''}`} onClick={() => handleTagClick(tag)}>
                                <span className='side-tab-pointer'/>
                                <span>{tag}</span>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default Side;