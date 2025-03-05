import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import logo from "../images/ofppt.png";
import profille from "../images/profille.svg";
import stagiaire from "../images/stagiaire.svg";
import module from "../images/module.svg";
import filier from "../images/filier.svg";
import plan from "../images/plan.svg";
import note from "../images/note.svg";

import "../styles/dashboard.css";

function TutteurSideBar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path for the className='focus'

    // Helper function to check if the current path matches multiple links (including dynamic paths)
    const isActive = (paths) => {
        return paths.some(
            (path) =>
                location.pathname === path || location.pathname.startsWith(path + "/")
        );
    };
    // --------------------------- Search Input -----------
    const logout = () => {
        const accesToken = localStorage.getItem("Token_Tutt");
        if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate("/tutteur/login");
        }
        try {
            axios({
                method: "delete",
                url: "http://localhost:8000/api/tutteur/logout",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + accesToken,
                },
            });
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem("Token_Tutt");
        navigate("/tutteur/login");
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
                            "/tutteur/listStagiaire",
                            "/tutteur/updateStagiaire",
                            "/tutteur/createStagiaire",
                        ])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={stagiaire} style={{ width: "24px" }} alt="" />
                    </p>
                    <Link to="/tutteur/listStagiaire">Stagiaires</Link>
                </div>
                <div
                    className={
                        isActive(["/tutteur/listModule", "/tutteur/updateModule"])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={module} alt="" />
                    </p>
                    <Link to="/tutteur/listModule">Modules</Link>
                </div>
                <div
                    className={
                        isActive([
                            "/tutteur/listFormatteurFiliereModule",
                            "/tutteur/updateFormatteurFiliereModule",
                        ])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={filier} alt="" />
                    </p>
                    <Link to="/tutteur/listFormatteurFiliereModule">
                        Enseignants
                    </Link>
                </div>
                <div
                    className={
                        isActive([
                            "/tutteur/listStagiaireModule",
                            "/tutteur/updateStagiaireModule",
                        ])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={plan} alt="" />
                    </p>
                    <Link to="/tutteur/listStagiaireModule">Planification</Link>
                </div>
                <div
                    className={
                        isActive(["/tutteur/listAbsence", "/tutteur/updateAbsence"])
                            ? "focus"
                            : ""
                    }
                >
                    <p className="image">
                        <img src={module} alt="" />
                    </p>
                    <Link to="/tutteur/listAbsence">Absences</Link>
                </div>
                <div
                    className={
                        location.pathname === "/tutteur/noteStagiaireTutt" ? "focus" : ""
                    }
                >
                    <p className="image">
                        <img src={note} alt="" />
                    </p>
                    <Link to="/tutteur/noteStagiaireTutt">Résultats</Link>
                </div>
                <div
                    className={location.pathname === "/tutteur/profile" ? "focus" : ""}
                >
                    <p className="image">
                        <img src={profille} alt="" />
                    </p>
                    <Link to="/tutteur/profile">Profile</Link>
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

export default TutteurSideBar;
