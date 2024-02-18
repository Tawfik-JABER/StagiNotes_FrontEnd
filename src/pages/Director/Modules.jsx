import React,{useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, Link}  from "react-router-dom";
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../styles/dashboard.css"

export default function Module() {
    //--------------------------------------- Check the token 

    const navigate = useNavigate();
    const [modules,setModules]= useState([])
    const [searchTerm, setSearchTerm] = useState('');


    
    const accesToken = localStorage.getItem('Token_dir');

    useEffect(() => {
        const accesToken = localStorage.getItem('Token_dir');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
        fetchModules();
    },[])
    const fetchModules = async() => {
        try{
            await axios.get(`http://localhost:8000/api/director/showModules`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                setModules(data.modules)
                console.log(modules)
            })
        }catch(error){
            console.log(error)
        }
    }
    // --------------------------- Search Input -----------
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const filteredModules = modules.filter((module) => {
        const NomModule = module.nom;
        return NomModule.toLowerCase().includes(searchTerm.toLowerCase());
    });
    // --------------------------- Search Input -----------
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
                <div>
                    <p className='image'>
                        <img src={filier} alt="" />
                    </p>
                    <Link to="/director/listFiliere">Les Filieres</Link>
                </div>
                <div  className='focus'>
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
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="i"/>
                    <input type="text" placeholder="Rechercher dans les collones par nom ou prenom" value={searchTerm} onChange={handleSearch} />
                </div>
                <div>
                    <Link to="/director/profile">
                        <img src={profile} alt="" />
                    </Link>
                </div>
        </div>
        <h4 className="h4">Les Modules</h4>
        <div className="overflow">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID Module</th>
                    <th scope="col">Nom Module</th>
                    <th scope="col">Code Module</th>
                    <th scope="col">Coefficient</th>
                </tr>
            </thead>
            <tbody>
                {
                modules &&(
                    filteredModules.map((row, key) => (
                        <tr key={key}>
                            <td>{row.id}</td>
                            <td>{row.nom}</td>
                            <td>{row.code}</td>
                            <td>{row.coefficient}</td>
                        </tr>
                        ))
                        )
                    }
            </tbody>

        </table>
        </div>
    </div>
    </>
    )
}




