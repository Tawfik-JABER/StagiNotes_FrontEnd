import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../images/ofppt.png"
import profile from "../../images/profile.png"
import profille from "../../images/profille.svg"
import home from "../../images/home.svg"
import stagiaire from "../../images/stagiaire.svg"
import module from "../../images/module.svg"
import filier from "../../images/filier.svg"
import log_out from "../../images/logout.svg"
import plan from "../../images/plan.svg"
import note from "../../images/note.svg"


import "../../styles/dashboard.css"

export default function FormatteurProfile() {

    const [cin, setCIN] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nomfill, setNomFill] = useState("");
    const [numero, setNumero] = useState("");
    const [cef, setCef] = useState("");
    const [group, setGroup] = useState("");
    const [annee, setAnnee] = useState("");
    const [niveau, setNiveau] = useState("npm s");
    const [sexe, setSexe] = useState("");
    const [emailVerif, setEmailVerif] = useState("");
    const [emailVerify, setEmailVerify] = useState("");
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // ------------------------------------------- fetching data for showing ----------
    useEffect(() => {
        const affiche = async () => {
            const accesToken = localStorage.getItem('Token_Stag');
            if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
                navigate('/stagiaire/login')
            }
            try {
                await axios({
                    method: "get",
                    url: "http://localhost:8000/api/stagiaire",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' + accesToken
                    }
                }).then((res) => {
                    const data = res.data.data; // Get the array of objects
                    if (data.length > 0) {
                        const firstStagiaire = data[0]; // Access the first object in the array

                        console.log(firstStagiaire);
                        setCIN(firstStagiaire.cin);
                        setNom(firstStagiaire.nom);
                        setPrenom(firstStagiaire.prenom);
                        setEmail(firstStagiaire.email);
                        setPassword(firstStagiaire.password);
                        setNomFill(firstStagiaire.nomFill);
                        setNumero(firstStagiaire.numero);
                        setCef(firstStagiaire.cef);
                        setGroup(firstStagiaire.group);
                        setAnnee(firstStagiaire.annee);
                        setNiveau(firstStagiaire.niveau);
                        setSexe(firstStagiaire.sexe);
                        setEmailVerif(firstStagiaire.email_verify);
                        console.log(emailVerif)
                        console.log(emailVerify)
                    }
                });
            } catch(error){
            console.error(error);
        }
    }
    affiche();
}, [])
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

    // ------------------------------------------- Update Email Verify  ----------
    const updateEmailVerify = () => {
        const accesToken = localStorage.getItem('Token_Stag');
        axios.post('http://localhost:8000/api/stagiaire/emailVerify', {
            email_verify: emailVerify
        }, {
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
    // ------------------------------------------- Update Password  ----------
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const accesToken = localStorage.getItem('Token_Stag');
        axios.post(`http://localhost:8000/api/stagiaire/changePassword`, {
                current_password: currentPassword,
                new_password: newPassword,
                password_confirmation: confirmPassword,
            }, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${accesToken}`
                }
                }).then((response) => {
                setSuccess(response.data.message);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate("/stagiaire"), 1000);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    console.log(error.response.data); // Output the response data to the console
                    setError(error.response.data.error);
                } else {
                    setError('Something went wrong. Please try again.');
                }
            });
    };
    return (
        <>
            <div className='side_bar'>
                <div className='image_ofppt' >
                    <img src={logo} alt="" />
                </div>
                <div className='section'>
                    <div style={{marginTop:"-200px"}}>
                        <p className='image'>
                        <img src={note} alt="" />
                        </p>
                        <Link to="/stagiaire/suiveNote">les Notes</Link>
                    </div>
                    <div  className='focus'>
                        <p className='image'>
                        <img src={profille} alt="" />
                        </p>
                        <Link to="/stagiaire/profile">Profile</Link>
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
                        <Link to="/stagiaire/profile">
                            <img src={profile} alt="" />
                        </Link>
                    </div>
                </div>
                <div className='infos'>
                <div className='info'>
                        <h4>information personelle</h4>
                        <div className='data1'>
                            <div className='ligne'>
                                <div className='column'>
                                    <p className='p1'>Nom</p>
                                    <p className='p2'>{nom}</p>
                                </div>
                                <div className='column'>
                                    <p className='p1'>Prenom</p>
                                    <p className='p2'>{prenom}</p>
                                </div>
                            </div>
                            <div className='ligne'>
                                <div className='column'>
                                    <p className='p1'>Email Adresse</p>
                                    <p className='p2'>{email}</p>
                                </div>
                                <div className='column'>
                                    <p className='p1'>Email Recupérée</p>
                                    <p className='p2'>{emailVerif ||  "défini d'e-mail de réinitialisation "}</p>
                                </div>
                            </div>
                            <div className='ligne'>
                                <div className='column'>
                                    <p className='p1'>Filier</p>
                                    <p className='p2'>{nomfill}</p>
                                </div>
                                <div className='column'>
                                    <p className='p1'>Group</p>
                                    <p className='p2'>{group}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='info'>
                        <h4>récupération du mot de passe</h4>
                        <div className='data2'>
                            <form action="">
                                <label htmlFor="">Email</label> <br />
                                <input type="text" value={emailVerify} placeholder='e-mail de réinitialisation' onChange={(e) => setEmailVerify(e.target.value)}/>
                            </form>
                            <button onClick={updateEmailVerify}>
                            Sauvegarder
                            </button>
                        </div>
                    </div>
                    <div className='info'>
                        <h4>modification du mot de passe</h4>
                        <div className='data3'>
                            {error && <div className="error">{error}</div>}
                            {success && <div className="success">{success}</div>}
                            <form action="" >
                                <label htmlFor="">Mot De Passe</label> <br />
                                <input type="password" id="current_password" value={currentPassword} placeholder='Actuel mot de passe' onChange={(e) => setCurrentPassword(e.target.value)}/>
                                <input type="password" id="new_password" value={newPassword} placeholder='Nouveau mot de passe' onChange={(e) => setNewPassword(e.target.value)}/>
                                <input type="password" id="confirm_password" value={confirmPassword} placeholder='Confirmer le Nouveau' onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </form>
                            <button onClick={handleSubmit}>
                                Modifier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}