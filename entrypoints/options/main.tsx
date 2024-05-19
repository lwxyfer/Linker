import React from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import App from './App.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
