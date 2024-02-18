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
import plan from "../../images/plan.svg"
import note from "../../images/note.svg"


import "../../styles/dashboard.css"

export default function Tutteur() {

    const [cin, setCIN] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sexe, setSexe] = useState("");
    const [emailVerif, setEmailVerif] = useState("");
    const [emailVerify, setEmailVerify] = useState("");
    const navigate = useNavigate();
    
    // ------------------------------------------- fetching data for showing ----------
    useEffect(() => {
        const affiche = async () => {
            const accesToken = localStorage.getItem('Token_Tutt');
            if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
                navigate('/tutteur/login')
            }
            try {
                await axios({
                    method: "get",
                    url: "http://localhost:8000/api/tutteur/",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accesToken
                    }
                }).then((res) => {
                    setCIN(res.data.data.cin)
                    setNom(res.data.data.nom)
                    setPrenom(res.data.data.prenom)
                    setEmail(res.data.data.email)
                    setPassword(res.data.data.password)
                    setSexe(res.data.data.sexe)
                    setEmailVerif(res.data.data.email_verify)
            })
        } catch(error){
            console.error(error);
        }
    }
    affiche();
}, [])
// ------------------------------------------- Log Out Function  ----------
const logout = () => {
    const accesToken = localStorage.getItem("Token_Tutt");
    if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate('/tutteur/login')
        }
        try {
            axios({
            method: 'delete',
            url: 'http://localhost:8000/api/tutteur/logout',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken
            }
        })
        }catch(error) {
            console.log(error);
        }

        localStorage.removeItem("Token_Tutt");
        navigate('/tutteur/login')
    }
    
    // ------------------------------------------- Update Email Verify  ----------
    const updateEmailVerify = () => { 
        const accesToken = localStorage.getItem('Token_Tutt');
        axios.post('http://localhost:8000/api/tutteur/emailVerify', {
            email_verify: emailVerify
        },{
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accesToken}`
            }
        })
        .then(response => {
            console.log(response.data.message);
            window.location.reload()
        })
        .catch(error => {
            console.error(error);
        });
    };
    return (
        <>
            <div className='side_bar'>
                <div className='image_ofppt' >
                    <img src={logo} alt="" />
                </div>
                <div className='section'>
                    <div className='focus'>
                        <p className='image'>
                        <img src={stagiaire} style={{width:"24px"}} alt="" />
                        </p>
                        <Link to="/tutteur/listStagiaire">les Stagiaires</Link>
                    </div>
                    <div>
                    <p className='image'>
                        <img src={module} alt="" />
                    </p>
                    <Link to="/tutteur/listModule">les Modules</Link>
                    </div>
                    <div>
                    <p className='image'>
                        <img src={filier} alt="" />
                    </p>
                        <Link to="/tutteur/listFormatteurFiliereModule">plan enseignants</Link>
                    </div>
                    <div>
                        <p className='image'>
                            <img src={plan} alt="" />
                        </p>
                        <Link to="/tutteur/listStagiaireModule">planification</Link>
                    </div>
                    <div>
                        <p className='image'>
                            <img src={module} alt="" />
                        </p>
                        <Link to="/tutteur/listAbsence">les Absences</Link>
                    </div>
                    <div>
                        <p className='image'>
                        <img src={note} alt="" />
                        </p>
                        <Link to="/tutteur/noteStagiaireTutt">les Notes</Link>
                    </div>
                    <div>
                        <p className='image'>
                        <img src={profille} alt="" />
                        </p>
                        <Link to="/tutteur/profile">Profile</Link>
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