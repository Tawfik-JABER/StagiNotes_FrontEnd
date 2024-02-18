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

export default function ListStagiaireDir() {
    //--------------------------------------- Check the token 

    const navigate = useNavigate();
    const [stagiaires,setStagiaires]= useState([])
    const [searchTerm, setSearchTerm] = useState('');

    
    const accesToken = localStorage.getItem('Token_dir');

    useEffect(() => {
        const accesToken = localStorage.getItem('Token_dir');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
        fetchStagiaire();
    },[])
    const fetchStagiaire = async() => {
        try{
            await axios.get(`http://localhost:8000/api/director/showStagiaires`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                console.log(data)
                setStagiaires(data.stagiaires)
            })
        }catch(error){
            console.log(error)
        }
    }
        // --------------------------- Search Input -----------
        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
        };
        
        const filteredStagiaires = stagiaires.filter((stagiaire) => {
            const fullName = stagiaire.nom + ' ' + stagiaire.prenom;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
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
                <div className='focus'>
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
        <h4 className="h4">Les Stagiaires</h4>
        <div className="overflow">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Cin</th>
                    <th scope="col">CEF</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Prenom</th>
                    <th scope="col">Email</th>
                    <th scope="col">Filiere</th>
                    <th scope="col">Group</th>
                    <th scope="col">Année</th>
                    <th scope="col">Niveau</th>
                    <th scope="col">Sexe</th>
                </tr>
            </thead>
            <tbody>
                {
                stagiaires &&(
                    filteredStagiaires.map((row, key) => (
                        <tr key={key}>
                            <td>{row.cin}</td>
                            <td>{row.cef}</td>
                            <td>{row.nom}</td>
                            <td>{row.prenom}</td>
                            <td>{row.email}</td>
                            <td>{row.nomFill}</td>
                            <td>{row.group}</td>
                            <td>{row.annee}</td>
                            <td>{row.niveau}</td>
                            <td>{row.sexe}</td>
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




