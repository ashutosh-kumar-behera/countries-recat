import { Outlet } from 'react-router-dom';
import {Header} from './components/Header.jsx';
import { createContext, useState } from 'react';
import './App.css';

export const UserContext=createContext();

function App() {

  const [isDark, setIsDark] = useState(
    JSON.parse(localStorage.getItem("isDarkMode"))
  );

  return (
    <>
      <UserContext.Provider value={[isDark, setIsDark]}>
        <Header />
        <Outlet />
      </UserContext.Provider>
    </>
  );
}

export default App;
