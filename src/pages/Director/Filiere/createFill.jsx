import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import logo from "../../../images/ofppt.png"
import profile from "../../../images/profile.png"
import profille from "../../../images/profille.svg"
import tutteur from "../../../images/tutteur.svg"
import home from "../../../images/home.svg"
import stagiaire from "../../../images/stagiaire.svg"
import module from "../../../images/module.svg"
import formatteur from "../../../images/formatteur.svg"
import filier from "../../../images/filier.svg"
import log_out from "../../../images/logout.svg"


import "../../../styles/dashboard.css"


export default function CreateFill() {
    //--------------------------------------- Check the token
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_dir');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
    })
    const navigate = useNavigate();

    const [nom,setNom]= useState("")
    const [description,setDescription]= useState("")
    
    const createFilier = async(e) => {
        const accesToken = localStorage.getItem('Token_dir');
        e.preventDefault();
        const formData = new FormData();
        formData.append("nom",nom)
        formData.append("description",description)
        await axios.post("http://localhost:8000/api/director/addFiliere",formData, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
        .then(({data})=> {
            console.log(data.message)
            navigate("/director/listFiliere")
        }).catch(({response})=>{
            if (response.status == 422){
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        })
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
                <div className='focus'>
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
                <div class="input-with-icon">

                </div>
                <div>
                    <Link to="/director/profile">
                        <img src={profile} alt="" />
                    </Link>
                </div>
        </div>
        <h4 className="h4">Créer Un Filiere</h4>
        <form action="" onSubmit={createFilier} className="form">
            <div>
            <label htmlFor="">Nom</label>  <br />
            <input type="text" value={nom} onChange={(e)=>{setNom(e.target.value)}}/>
            </div>
            <div>
            <label htmlFor="">Description</label> <br />
            <input type="text" value={description} onChange={(e)=>{setDescription(e.target.value)}} />
            </div>
            <button type="submit">Ajouter</button>
        </form>
    </div>
        </>
    )
}