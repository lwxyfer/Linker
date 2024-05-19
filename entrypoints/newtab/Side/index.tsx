import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    FolderOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Tree } from 'antd';
import { DataContext, DataContextInterface } from '../Context'

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
                icon: <FolderOutlined style={{fontSize: 18}} />
            };
        }
        return {
            title: node.title,
            key: node.id,
            icon: <FolderOutlined style={{ fontSize: 18 }} />
        };
    });



const Side: React.FC = () => {
    const { list, onActiveIdChange } = React.useContext<DataContextInterface | undefined>(DataContext) || { list: [] };
    const tree = list2Tree(list);

    const treeData = renderTreeNodes(tree)

    const handleMenuClick = (selectedKeys, info) => {
        console.log('Menu item clicked:', selectedKeys, info);

        onActiveIdChange?.(selectedKeys?.[0])
    };

    return (
        <div>
            <div className="side-logo">BMP</div>
            <h4 className='side-tag'>书签目录</h4>
            <div style={{paddingLeft: 6, paddingRight: 6}}>
                <Tree showIcon
                    defaultSelectedKeys={['0-0-0']}
                    treeData={treeData}
                    onSelect={handleMenuClick}
                    blockNode
                />
            </div>
            
            <div className='side-tag'>
                <h4>标签列表</h4>
            </div>
        </div>
    );
};

export default Side;