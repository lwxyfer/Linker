import React, { useState } from 'react';
import './App.css';
import Add from './CreateForm'

function App() {
  React.useEffect(() => {

    // chrome.tabs.executeScript(tab.id, { file: 'content.ts' }, () => {
    //   // 向Content Script发送消息以获取OG信息
    //   chrome.tabs.sendMessage(tab.id, { action: 'getOGInfo' });
    // });
  }, [])

  return (
    <>
      <Add />
    </>
  );
}

export default App;
