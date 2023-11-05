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
    const menuItem = [
        {
            path:"/app/dashboard",
            name:"dashboard",
            icon:<FaTh/>
        },
        {
            path:"/app/paciente",
            name:"paciente",
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
            name:"ajuste",
            icon:<FaShoppingBag/>
        },
        {
            path:"/app/agenda",
            name:"agenda",
            icon:<FaThList/>
        },
    ]
    return (
        <div className="container">
            <div style={{width: isOpen ? "300px" : "50px"}} className="sidebar">
                <div className="top_section">
                    <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
                    <div style={{marginLeft: isOpen ? "120px" : "0px"}} className="bars">
                        <FaBars onClick={toggle}/>
                    </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}
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