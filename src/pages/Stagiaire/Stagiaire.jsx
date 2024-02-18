import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Stagiaire() {
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
    const [niveau, setNiveau] = useState("");
    const [sexe, setSexe] = useState("");
    const [emailVerif, setEmailVerif] = useState("");
    const [emailVerify, setEmailVerify] = useState("");
    const navigate = useNavigate();
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
                        console.log(firstStagiaire.cin);
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
                        setEmailVerif(firstStagiaire.email_verif);
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
        }catch(error) {
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
        <div className='links'>
            <div>
                <Link to="/stagiaire/suiveNote">suivi les notes</Link>
            </div>
            <div>
                <Link to="/director/ListTutteur">Les Tutteures</Link>
            </div>
            <div>
                <Link to="/director/listFiliere">Les Filieres</Link>
            </div>
            <div>
                <Link to="/director/stagiaires">Les Stagiaires</Link>
            </div>
            <div>
                <Link to="/director/modules">Les Modules</Link>
            </div>
        </div>
        <p>cin : {cin}</p>
        <p>nom : {nom}</p>
        <p>prenom : {prenom}</p>
        <p>email : {email}</p>
        <p>password : {password}</p>
        <p>filiere : {nomfill}</p>
        <p>numero  : {numero}</p>
        <p>cef : {cef}</p>
        <p>group : {group}</p>
        <p>annee : {annee}</p>
        <p>niveau : {niveau}</p>
        <p>sexe : {sexe}</p>
        <p>Email reset : {emailVerif || "you need to set an email reset password"}</p>
        <button onClick={logout}>Deconnecter</button>
        <br />

        <Link to="/stagiaire/changePassword">Changer Password</Link>
        <br />
        <br />
        <div>
            <input
                type="text"
                value={emailVerify}
                onChange={e => setEmailVerify(e.target.value)}
            />
            <button onClick={updateEmailVerify}>Update Email Verify</button>
        </div>
        </>
    )
    }