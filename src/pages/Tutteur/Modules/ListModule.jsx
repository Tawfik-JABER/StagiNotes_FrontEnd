import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export default function ListModule() {


    const navigate = useNavigate();
    const [modules,setModules]= useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const[nom,setNom]= useState("")
    const[code,setCode]= useState("")
    const[coefficient,setCoefficient]= useState("")
    
    const accesToken = localStorage.getItem('Token_Tutt');
    //  -------------------------------- Create Module
    const createModule = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("code",code)
        formData.append("nom",nom)
        formData.append("coefficient",coefficient)
        await axios.post("http://localhost:8000/api/tutteur/addModule",formData, {
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
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/tutteur/login')
        }
        fetchModules();
    },[])
    //  -------------------------------- Show Modules
    const fetchModules = async() => {
        try{
            await axios.get(`http://localhost:8000/api/tutteur/showModules`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                console.log(data)
                setModules(data.modules)
            })
        }catch(error){
            console.log(error)
        }
    }
    
    //  -------------------------------- Delete Module
    const deleteModule = async(id) => {
        /* eslint-disable no-restricted-globals */
        const confirmed = confirm(`tu peux suprimer ce Module avec id ${id}`)
        if(confirmed) {
            await axios.delete(`http://localhost:8000/api/tutteur/deleteModule/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({data})=> {
                console.log(data.message)
                fetchModules()
            }).catch(({response: {data} })=>{
                console.log(data.message)
                if (data.status == 422){
                    console.log(data.errors)
                }
            })
        }
    }
        // --------------------------- Search Input -----------
        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
        };
        
        const filteredModules = modules.filter((module) => {
            const ModuleName = module.nom ;
            return ModuleName.toLowerCase().includes(searchTerm.toLowerCase());
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
                        <div  className='focus'>
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
        <h4 className="h4" style={{margin:"-50px 60px -20px"}}>Créer Un Module</h4>
        <form action="" onSubmit={createModule} className="form" style={{margin:"100px 60px 20px"}}>
            <div className="div">
                <label htmlFor="">Code</label> <br />
                <input type="text" placeholder='Code de module' value={code} onChange={(e)=>{setCode(e.target.value)}} />
            </div>
            <div className="div">
                <label htmlFor="">Nom</label> <br />
                <input type="text" value={nom} placeholder='Nom de module' onChange={(e)=>{setNom(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">Coefficient</label> <br />
                <input type="text" value={coefficient} placeholder='Coefficient de module' onChange={(e)=>{setCoefficient(e.target.value)}}/>
            </div>
            <button type="submit">Ajouter</button>
        </form>
        <div className="overflow">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom Module</th>
                    <th scope="col">Code Module</th>
                    <th scope="col">Coefficient</th>
                    <th scope="col" colspan="2"></th>
                </tr>
            </thead>
            <tbody>
                {
                modules &&(
                    filteredModules.map((row, key) => (
                        <tr key={key}>
                            <td scope='row'>{row.id}</td>
                            <td>{row.nom}</td>
                            <td>{row.code}</td>
                            <td>{row.coefficient}</td>
                            <td style={{cursor:"pointer"}}>
                                <FontAwesomeIcon onClick={() => deleteModule(row.id)} icon={faTrash} />
                            </td>
                            <td>
                                <Link to={`/tutteur/updateModule/${row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
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




