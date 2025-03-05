import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import logo from "../images/ofppt.png";
import profille from "../images/profille.svg";
import tutteur from "../images/tutteur.svg";
import stagiaire from "../images/stagiaire.svg";
import module from "../images/module.svg";
import formatteur from "../images/formatteur.svg";
import filier from "../images/filier.svg";

import "../styles/dashboard.css";


function DirectorSideBar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path for the className='focus'

    // Helper function to check if the current path matches multiple links (including dynamic paths)
    const isActive = (paths) => {
        return paths.some(
            (path) =>
                location.pathname === path || location.pathname.startsWith(path + "/")
        );
    };

    // ------------------------------------------- Log Out Function  ----------
    const logout = () => {
        const accesToken = localStorage.getItem("Token_dir");
        if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate("/director/login");
        }
        try {
            axios({
                method: "delete",
                url: "http://localhost:8000/api/director/logout",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + accesToken,
                },
            });
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem("Token_dir");
        navigate("/director/login");
    };

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
            <div className="section">
                <div
                    className={
                        isActive([
                            "/director/listFormatteur",
                            "/director/createFormatteur",
                            "/director/updateFormatteur",
                        ])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={formatteur} style={{ width: "24px" }} alt="" />
                    </p>
                    <Link to="/director/listFormatteur">Formatteures</Link>
                </div>
                <div
                    className={
                        isActive([
                            "/director/listTutteur",
                            "/director/createTutteur",
                            "/director/updateTutteur",
                        ])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={tutteur} alt="" />
                    </p>
                    <Link to="/director/listTutteur">Tutteures</Link>
                </div>
                <div
                    className={
                        location.pathname === "/director/stagiaires" ? "focus" : ""
                    }
                >
                    <p className="image">
                        <img src={stagiaire} alt="" />
                    </p>
                    <Link to="/director/stagiaires">Stagiaires</Link>
                </div>
                <div
                    className={
                        isActive([
                            "/director/listFiliere",
                            "/director/createFiliere",
                            "/director/updateFiliere",
                        ])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={filier} alt="" />
                    </p>
                    <Link to="/director/listFiliere">Filieres</Link>
                </div>
                <div
                    className={location.pathname === "/director/modules" ? "focus" : ""}
                >
                    <p className="image">
                        <img src={module} alt="" />
                    </p>
                    <Link to="/director/modules">Modules</Link>
                </div>
                <div className={location.pathname === "/director/profile" ? "focus" : ""}>
                    <p className="image">
                        <img src={profille} alt="" />
                    </p>
                    <Link to="/director/profile">Profile</Link>
                </div>
            </div>
            <div className="logout">
                <LogoutOutlinedIcon />
                <span onClick={logout}>Déconnexion</span>
            </div>
        </div>
    </>
    );
}

export default DirectorSideBar;
