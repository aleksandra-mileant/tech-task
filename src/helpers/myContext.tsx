import { createContext, useContext } from "react";
interface MyContextProps {
  rows: number;
  cells: number;
  setRows: (value: number) => void;
  setCells: (value: number) => void;
}

export const MyContext = createContext<MyContextProps>({
  rows: 0,
  cells: 0,
  setRows: () => {},
  setCells: () => {},
});

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
}