import { useContext } from "react";
import { UserContext } from "../App";

export const Header=()=>{
    const data =useContext(UserContext);
    const[isDark, setIsDark]=data;

    const themeChanger = () =>{
        setIsDark(!isDark);
        localStorage.setItem('isDarkMode',!isDark);
    }
    
    return(
         <header className={`header-container ${isDark ? 'dark':""}`}>
            <div className="header-content">
                <h2 className="title"><a href="/">Where in the world?</a></h2>
                <p className="theme-changer" onClick={themeChanger}><i className={`fa-solid fa-${isDark?'sun':'moon'}`}></i>&nbsp;&nbsp;{isDark ? "Light Mode" : "Dark Mode"}</p>
            </div>
        </header>
    )
}