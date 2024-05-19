import React from 'react';
import { Input, Row, Col, AutoComplete, Button } from 'antd';
import wxtLogo from '@/assets/wxt.svg';
import bookmarkPro from '@/entrypoints/common/bookmark'
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { groupBookmarksByParentID  } from '@/entrypoints/common/bookmarkUtils'
import { DataContext, DataContextInterface } from '../Context'

import './style.css'; // 引入自定义CSS样式



const Hero: React.FC = () => {
    const { list } = React.useContext<DataContextInterface | undefined>(DataContext) || { list: [] };;

    const listApp = list.filter((item) => {
        return item.isHome === true && item.url;
    });

    const dataSource = [{
        label: 'Option1',
        value: 'Option1',
    },];

    return (
        <div className="hero-component">
            <div className='hero-bg' />
            <div className="center">
                <div className="logo">
                    {/* <img src={wxtLogo} alt="Logo" /> */}
                </div>
                <div className="search-box">
                    {/* <AutoComplete
                        style={{ width: 200 }}
                        options={dataSource}
                        placeholder="输入搜索"
                    /> */}
                </div>
                <Row gutter={16} className="hero-list">
                    {listApp.map(app => (
                        <Col key={app.id} span={4}>
                            <a href={app.url} className='hero-list-app'>
                                <img src={app.favIconUrl} alt={`Icon ${app.id}`} className='hero-list-app-logo' />
                                <p className='hero-list-app-title'>{app.title}</p>
                            </a>
                        </Col>
                    ))}
                    <Col key="new" span={4}>
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
        </div>
    );
};

export default Hero;