import React, { useState } from 'react';
import './App.css';
import { Main } from "./components/Main";
import { MyContext } from './helpers/myContext';

export interface Cell {
  id: number;
  amount: number;
}
function App() {
  const [rows, setRows] = useState<number>(6);
  const [cells, setCells] = useState<number>(5);

  return (
    <MyContext.Provider value={{ rows, cells, setRows, setCells }}>
      <Main />
    </MyContext.Provider>
  );
}

export default App;
