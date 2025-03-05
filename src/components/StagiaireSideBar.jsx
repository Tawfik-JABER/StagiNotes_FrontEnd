import React, { useState } from "react";

import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import logo from "../images/ofppt.png"
import profille from "../images/profille.svg"
import note from "../images/note.svg"

import "../styles/dashboard.css"

function StagiaireSideBar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path for the className='focus'

    // ------------------------------------------- Log Out Function  ----------
    const logout = () => {
        const accesToken = localStorage.getItem("Token_Stag");
        if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate('/stagiaire/login')
        }
        try {
            axios({
                method: 'delete',
                url: 'http://localhost:8000/api/stagiaire/logout',
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken
                }
            })
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem("Token_Stag");
        navigate('/stagiaire/login')
    }
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
        <WidgetsOutlinedIcon onClick={toggleSidebar} className="menu_icon" />
        {isOpen ? <div className="overlay"></div> : ''}
        <div className={`side_bar ${isOpen ? "show" : "hide"}`}>
            <div className="image_ofppt">
                <img src={logo} alt="" />
                <CloseOutlinedIcon className="close_icon" onClick={toggleSidebar} />
            </div>
            <div className='section'>
                <div className={location.pathname === "/stagiaire/suiveNote" ? "focus" : ""} style={{ marginTop: "-200px" }}>
                    <p className='image'>
                        <img src={note} alt="" />
                    </p>
                    <Link to="/stagiaire/suiveNote">Résultats</Link>
                </div>
                <div className={location.pathname === "/stagiaire/profile" ? "focus" : ""}>
                    <p className='image'>
                        <img src={profille} alt="" />
                    </p>
                    <Link to="/stagiaire/profile">Profile</Link>
                </div>
            </div>
            <div className='logout'>
                <LogoutOutlinedIcon />
                <span onClick={logout}>Déconnexion</span>
            </div>
        </div>
        </>
    )
}

export default StagiaireSideBar