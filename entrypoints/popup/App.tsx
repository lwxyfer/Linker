import React, { useState } from 'react';
import './App.css';
import Add from './CreateForm'

function App() {
  // const [url, setUrl] = useState('');

  // React.useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     const tab = tabs[0];
  //     setUrl(tab.url);
  //   });
  // }, []);

  // if (url.startsWith('chrome://')) {
  //   return <div>请到网页添加</div>;
  // }

  return (
    <>
      <Add />
    </>
  );
}

export default App;
