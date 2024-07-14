import React from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import { isZH } from '@/entrypoints/common/utils.ts'
import enGB from 'antd/locale/en_GB';

import { ConfigProvider, theme } from 'antd';
import App from './App.tsx';
import './style.css'


// const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const customTheme = {
  // algorithm: darkMode ? theme.darkAlgorithm : undefined, 
  token: {
    colorPrimary: '#FF6500',
    colorLink: '#FF6500',
    colorLinkHover: '#FF6500',
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
    <ConfigProvider locale={isZH() ? zhCN : enGB} theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
