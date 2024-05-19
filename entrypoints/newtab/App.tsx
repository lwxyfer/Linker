import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import ContextProvider from './Context'

import Hero from './Hero'
import GroupList from './GroupList'
import Side from './Side'

const { Header, Content, Footer, Sider } = Layout;


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ContextProvider>
      <Layout style={{ minHeight: '100vh' }} hasSider>
        <Sider theme={'light'} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} 
          style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}  
          width={240}
        >
          <Side />
        </Sider>
        <Layout style={{ marginLeft: 240 }}>
          <Content style={{ margin: '0 16px', background: colorBgContainer }}>
            <Hero />
            <GroupList />
          </Content>
        </Layout>
      </Layout>
    </ContextProvider>
  );
};

export default App;