import React, { useState } from "react";
import '../App.css';
import {
    FaBars,
    FaCommentAlt,
    FaRegChartBar,
    FaShoppingBag,
    FaTh, FaThList, FaUserAlt,
} from 'react-icons/fa'
import {NavLink} from 'react-router-dom';

const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);

    const setDarkMode = () =>{
        document.querySelector("body").setAttribute('data-theme', 'dark')
        localStorage.setItem("selectedTheme", "dark")
    }; 

    const setLightMode = () =>{
        document.querySelector("body").setAttribute('data-theme', 'light')
        localStorage.setItem("selectedTheme", "light")
    };

    const selectedTheme = localStorage.getItem("selectedTheme");

    if (selectedTheme === "dark"){
        setDarkMode();
    };

    const toggleTheme = (e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode()
    };

    const menuItem = [
        {
            path:"/app/dashboard",
            name:"Dashboard",
            icon:<FaTh/>
        },
        {
            path:"/app/paciente",
            name:"Paciente",
            icon:<FaUserAlt/>
        },
        {
            path:"/app/analytics",
            name:"Analytics",
            icon:<FaRegChartBar/>
        },
        {
            path:"/app/comment",
            name:"Comment",
            icon:<FaCommentAlt/>
        },
        {
            path:"/app/Ajustes",
            name:"Ajuste",
            icon:<FaShoppingBag/>
        },
        {
            path:"/app/agenda",
            name:"Agenda",
            icon:<FaThList/>
        },
    ]
    return (
          <div className="container">
            <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <div className='dark_mode'style={{ display: isOpen ? "block" : "none" }}>
                        <input
                            className='dark_mode_input'
                            type='checkbox'
                            id='darkmode-toggle'
                            onChange={toggleTheme}
                            defaultChecked={selectedTheme === "dark"}
                        />
                        <label className='dark_mode_label' for='darkmode-toggle'>

                        </label>
                    </div>
                    <div style={{ marginLeft: isOpen ? "120px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeclassName="active" style={{alignItems:'center'}}>
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}
                            </div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>
    );
};
export default Sidebar;