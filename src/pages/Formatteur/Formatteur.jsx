import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Formatteur() {

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
            const accesToken = localStorage.getItem('Token_Form');
            if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
                navigate('/formatteur/login')
            }
            try {
                await axios({
                    method: "get",
                    url: "http://localhost:8000/api/formatteur",
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
    const accesToken = localStorage.getItem("Token_Form");
    if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate('/formatteur/login')
        }
        try {
            axios({
            method: 'delete',
            url: 'http://localhost:8000/api/formatteur/logout',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken
            }
        })
        }catch(error) {
            console.log(error);
        }

        localStorage.removeItem("Token_Stag");
        navigate('/formatteur/login')
    }
    
    // ------------------------------------------- Update Email Verify  ----------
    const updateEmailVerify = () => { 
        const accesToken = localStorage.getItem('Token_Form');
        axios.post('http://localhost:8000/api/formatteur/emailVerify', {
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
                <Link to="/formatteur/ListNote">Citer les Notes Par Module</Link>
            </div>
        </div>
        <p>cin : {cin}</p>
        <p>nom : {nom}</p>
        <p>prenom : {prenom}</p>
        <p>email : {email}</p>
        <p>password : {password}</p>
        <p>sexe : {sexe}</p>
        <p>Email reset : {emailVerif || "you need to set an email reset password"}</p>
        <button onClick={logout}>Deconnecter</button>
        <br />

        <Link to="/formatteur/changePassword">Changer Password</Link>
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