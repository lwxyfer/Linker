import React from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import enGB from 'antd/locale/en_GB';
import { ConfigProvider, theme } from 'antd';
import App from './App.tsx';
import './style.css';
import mock from '../common/mock.ts'
import { isZH } from '@/entrypoints/common/utils.ts'


// mock()


const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const customTheme = {
  token: {
    colorPrimary: '#FF6500',
  },
  // algorithm: darkMode ? theme.darkAlgorithm : undefined, 
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
    <ConfigProvider locale={isZH() ? zhCN : enGB} theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
