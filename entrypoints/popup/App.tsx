import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import Add from './CreateForm'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Add />
    </>
  );
}

export default App;
