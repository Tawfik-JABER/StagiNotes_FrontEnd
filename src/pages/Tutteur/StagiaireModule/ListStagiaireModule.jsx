import React,{useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, Link}  from "react-router-dom";

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
import plan from "../../../images/plan.svg"
import note from "../../../images/note.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


import "../../../styles/dashboard.css"

export default function ListStagiaireModule() {


    const navigate = useNavigate();
    // pour le tableau
    const[stagiaireModules,setStagiaireModules]= useState([])
    const [searchTerm, setSearchTerm] = useState('');
    // pour la formulaire
    const [modules,setModules]= useState([])
    const [stagiaires,setStagiaires] = useState([])

    const[stagiaire_id,setStagiaire_id]= useState("")
    const[module_id,setModule_id]= useState("")
    // set values for id
    const handleSelectChange1 = (event) => {
        setStagiaire_id(event.target.value);
    };

    const handleSelectChange2 = (event) => {
        setModule_id(event.target.value);
    };


    const accesToken = localStorage.getItem('Token_Tutt');
    //  --------------------------------------- Create 
    const createStagiaireModule = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("stagiaire_id",stagiaire_id)
        formData.append("module_id",module_id)
        await axios.post("http://localhost:8000/api/tutteur/addStagiaireModule",formData, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
        .then(({data})=> {
            console.log(data.message)
            window.location.reload()
        }).catch(({response})=>{
            if (response.status == 422){
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        })
    }
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        if (!accesToken) {
            navigate('/tutteur/login')
        }
        fetchStagiaireModules();
    },[])
    //  --------------------------------------- Show 
    const fetchStagiaireModules = async() => {
        try{
            await axios.get(`http://localhost:8000/api/tutteur/showStagiaireModules`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                console.log(data)
                setStagiaireModules(data.stagiaireModules)
                setModules(data.modules)
                setStagiaires(data.stagiaires)
            })
        }catch(error){
            console.log(error)
        }
    }
    
    //  -------------------------------- Delete Module
    const deleteStagiaireModule = async(id) => {
        console.log(id)
        /* eslint-disable no-restricted-globals */
        const confirmed = confirm(`tu peux suprimer ce Module avec id ${id}`)
        if(confirmed) {
            await axios.delete(`http://localhost:8000/api/tutteur/deleteStagiaireModule/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({data})=> {
                console.log(data.message)
                fetchStagiaireModules()
            }).catch(({response: {data} })=>{
                console.log(data.message)
            })
        }
    }
        // --------------------------- Search Input -----------
        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
        };
        
        const filteredStagiaireModule = stagiaireModules.filter((stagiaireModule) => {
            const { nomModule, nomStagiaire } = stagiaireModule;
            const lowercaseSearchTerm = searchTerm.toLowerCase();
            return (
                nomModule.toLowerCase().includes(lowercaseSearchTerm) ||
                nomModule.toLowerCase().includes(lowercaseSearchTerm)
            );
        });
        // --------------------------- Search Input -----------
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
        return (
            <>
                <div className='side_bar'>
                    <div className='image_ofppt' >
                        <img src={logo} alt="" />
                    </div>
                    <div className='section'>
                        <div>
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
                        <div className="focus">
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
        <h4 className="h4" style={{margin:"-50px 60px -20px"}}>Créer Un enseignant</h4>
        <form action="" onSubmit={createStagiaireModule} className="form" style={{margin:"100px 60px 20px"}}>
            <div className="div">
                <label htmlFor="">stagiaire</label> <br />
                <select value={stagiaire_id} onChange={handleSelectChange1}>
                    {stagiaires.map((stagiare) => (
                        <option key={stagiare.id} value={stagiare.id}>
                        {stagiare.nom}
                        </option>
                    ))}
                </select>
            </div>
            <div className="div">
                <label htmlFor="">Filiere</label> <br />
                <select value={module_id} onChange={handleSelectChange2}>
                <option value="" selected disabled>Choisir un module</option>
                    {modules.map((module) => (
                        <option key={module.id} value={module.id}>
                        {module.nom}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Ajouter</button>
        </form>
        <div className="overflow">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Stagiaire</th>
                    <th scope="col">Module</th>
                    <th scope="col" colspan="2"></th>
                </tr>
            </thead>
            <tbody>
                {
                stagiaireModules &&(
                    filteredStagiaireModule.map((row, key) => (
                        <tr key={key}>
                            <td>{row.id}</td>
                            <td>{row.nomStagiaire}</td>
                            <td>{row.nomModule}</td>
                            <td style={{cursor:"pointer"}}>
                                <FontAwesomeIcon onClick={() => deleteStagiaireModule(row.id)} icon={faTrash} />
                            </td>
                            <td>
                                <Link to={`/tutteur/updateStagiaireModule/${row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                            </td>
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




