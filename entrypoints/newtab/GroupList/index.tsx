import React from 'react';
import { Input, Row, Col, AutoComplete } from 'antd';
import wxtLogo from '@/assets/wxt.svg';
import bookmarkPro from '@/entrypoints/common/bookmark'
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { groupBookmarksByParentID } from '@/entrypoints/common/bookmarkUtils'
import { getFavicon } from '@/entrypoints/common/utils'

import { DataContext } from '../Context'

import './style.css'; // 引入自定义CSS样式

const Group: React.FC = () => {
    const { list, activeId } = React.useContext(DataContext)
    const groupBookmarks = groupBookmarksByParentID(list)

    const handleScrollTo = (index: number) => {
        const element = document.getElementById(`item-${index}`);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        if (activeId) {
            handleScrollTo(activeId)
        }
    }, [activeId])

    return (
        <div className="group-component">
                {
                    Object.values(groupBookmarks).map((group) => {
                        return (
                            <div className='group-block' id={`item-${group[0].parentId}`}>
                                <h3>{bookmarkPro.syncGet(group[0].parentId)?.title}</h3>
                                <Row gutter={16} className="group-list">
                                    {group.map(app => (
                                        <Col key={app.id} xs={12} md={6} lg={4}>
                                            <a href={app.url} className='group-list-app'>
                                                <img src={getFavicon(app.url)} alt={`Icon ${app.id}`} className='group-list-app-logo' />
                                                <p className='group-list-app-title'>{app.title}</p>
                                            </a>
                                        </Col>
                                    ))}
                                    <Col key="new" xs={12} md={6} lg={4}>
                                        <div className='hero-list-action'>
                                            <div className='icon-action'>
                                                <PlusOutlined style={{ fontSize: 24, color: '#333' }} />
                                            </div>
                                            <div className='icon-action'>
                                                <EditOutlined style={{ fontSize: 24, color: '#333' }} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                }
        </div>
    );
};

export default Group;