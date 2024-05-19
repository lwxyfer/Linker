import React from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import App from './App.tsx';
import './style.css';
import mock from '../common/mock.ts'

mock()

const customTheme = {
  token: {
    colorPrimary: '#FF6500',
  },
  components: {
    Tree: {
      directoryNodeSelectedBg: '#FF6500',
      nodeSelectedBg: '#FF6500',
      nodeHoverBg: '#FF6500',
    }
  }
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
