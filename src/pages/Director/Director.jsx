import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../images/ofppt.png"
import profile from "../../images/profile.png"
import profille from "../../images/profille.svg"
import tutteur from "../../images/tutteur.svg"
import home from "../../images/home.svg"
import stagiaire from "../../images/stagiaire.svg"
import module from "../../images/module.svg"
import formatteur from "../../images/formatteur.svg"
import filier from "../../images/filier.svg"
import log_out from "../../images/logout.svg"


import "../../styles/dashboard.css"


export default function Director() {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");

    const navigate = useNavigate();
    // ------------------------------------------- fetching data for showing ----------
    
    useEffect(() => {
            const accesToken = localStorage.getItem('Token_dir');
            if (!accesToken) {
                setShouldRedirect(true);
            }
        affiche();
    }, []);

    if (shouldRedirect) {
        navigate('/director/login');
        return null; // Render nothing while redirecting
      }
    const accesToken = localStorage.getItem('Token_dir');
    const affiche = async () => {
        try {
                await axios({
                    method: "get",
                    url: "http://localhost:8000/api/director/",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accesToken
                    }
                }).then((res) => {
                    setNom(res.data.data.nom)
                    setPrenom(res.data.data.prenom)
            })
        } catch(error){
            console.error(error);
        }
    }
// ------------------------------------------- Log Out Function  ----------
const logout = () => {
    const accesToken = localStorage.getItem("Token_dir");
    if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate('/director/login')
        }
        try {
            axios({
            method: 'delete',
            url: 'http://localhost:8000/api/director/logout',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken
            }
        })
        }catch(error) {
            console.log(error);
        }
        localStorage.removeItem("Token_dir");
        navigate('/director/login')
    }
    

    return (
        <>
            <div className='side_bar'>
                <div className='image_ofppt' >
                    <img src={logo} alt="" />
                </div>
                <div className='section'>
                    <div className='focus'>
                        <p className='image'>
                        <img src={home} alt="" />
                        </p>
                        <Link to="/director">Accueil</Link>
                    </div>
                    <div>
                        <p className='image'>
                        <img src={formatteur} style={{width:"24px"}} alt="" />
                        </p>
                        <Link to="/director/listFormatteur">Les Formatteures</Link>
                    </div>
                    <div>
                    <p className='image'>
                        <img src={tutteur} alt="" />
                    </p>
                        <Link to="/director/ListTutteur">Les Tutteures</Link>
                    </div>
                    <div>
                    <p className='image'>
                        <img src={stagiaire} alt="" />
                    </p>
                        <Link to="/director/stagiaires">Les Stagiaires</Link>
                    </div>
                    <div>
                        <p className='image'>
                            <img src={filier} alt="" />
                        </p>
                        <Link to="/director/listFiliere">Les Filieres</Link>
                    </div>
                    <div>
                        <p className='image'>
                            <img src={module} alt="" />
                        </p>
                        <Link to="/director/modules">Les Modules</Link>
                    </div>
                    <div>
                        <p className='image'>
                        <img src={profille} alt="" />
                        </p>
                        <Link to="/director/profile">Profile</Link>
                    </div>
                </div>
                <div className='logout'>
                    <img src={log_out} alt="" />
                    <span onClick={logout}>Deconnecter</span>
                </div>
            </div>
            <div className='content'>
                <div className='nav'>
                    <div>
                        Salut, {nom} {prenom}
                    </div>
                    <div>
                        <Link to="/director/profile">
                            <img src={profile} alt="" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
    }