import React, { useState } from "react";
import '../App.css';
import {
    FaBars,
    FaCommentAlt,
    FaShoppingBag,
    FaTh, FaThList, FaUserAlt, FaMoneyBillWave,
} from 'react-icons/fa'
import {AiFillSchedule} from 'react-icons/ai'; 
import {BsGearFill} from 'react-icons/bs';   
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/app/Inicio",
            name: "Inicio",
            icon: <FaTh />
        },
        {
            path: "/app/Pacientes",
            name: "Pacientes",
            icon: <FaUserAlt />
        },
        {
            path: "/app/Agenda",
            name: "Agenda",
            icon: <AiFillSchedule/>
        },
        {
            path: "/app/Financeiro",
            name: "Financeiro",
            icon: <FaMoneyBillWave />
        },
        {
            path: "/app/Ajustes",
            name: "Ajustes",
            icon: <BsGearFill/>
        },
    ]
    return (
        <div className="container">
            <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Logo</h1>
                    <div style={{ marginLeft: isOpen ? "120px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
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