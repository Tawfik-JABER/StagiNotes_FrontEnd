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

export default function ListStagiaire() {
    //--------------------------------------- Check the token 

    const navigate = useNavigate();
    const [stagiaires,setStagiaires]= useState([])
    const [searchTerm, setSearchTerm] = useState('');

    
    const accesToken = localStorage.getItem('Token_Tutt');

    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/tutteur/login')
        }
        fetchStagiaires();
    },[])
    const fetchStagiaires = async() => {
        try{
            await axios.get(`http://localhost:8000/api/tutteur/showStagiaires`, {
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

    const deleteStagiaire = async(id) => {
        /* eslint-disable no-restricted-globals */
        const confirmed = confirm(`tu peux suprimer ce stagiaire avec id ${id}`)
        if (confirmed) {
            await axios.delete(`http://localhost:8000/api/tutteur/deleteStagiaire/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
                .then(({data})=> {
                    console.log(data.message)
                    fetchStagiaires()
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
        
        const filteredStagiaires = stagiaires.filter((stagiaire) => {
            const fullName = stagiaire.nom + ' ' + stagiaire.prenom;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
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
                    <th scope="col">CIN</th>
                    <th scope="col">CEF</th>
                    <th scope="col">Numero</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Prenom</th>
                    <th scope="col">Email</th>
                    <th scope="col">Filiere</th>
                    <th scope="col">Group</th>
                    <th scope="col">Année</th>
                    <th scope="col">Niveau</th>
                    <th scope="col">Sexe</th>
                    <th scope="col" colspan="2"></th>
                </tr>
            </thead>
            <tbody>
                {
                stagiaires &&(
                    filteredStagiaires.map((row, key) => (
                        <tr key={key}>
                            <td scope="row">{row.cin}</td>
                            <td>{row.cef}</td>
                            <td>{row.numero}</td>
                            <td>{row.nom}</td>
                            <td>{row.prenom}</td>
                            <td>{row.email}</td>
                            <td>{row.nomFill}</td>
                            <td>{row.group}</td>
                            <td>{row.annee}</td>
                            <td>{row.niveau}</td>
                            <td>{row.sexe}</td>
                            <td style={{cursor:"pointer"}}>
                                <FontAwesomeIcon onClick={() => deleteStagiaire(row.id)} icon={faTrash} />
                            </td>
                            <td>
                                <Link to={`/tutteur/updateStagiaire/${row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                            </td>
                            </tr>
                        ))
                        )
                    }
            </tbody>

        </table>
        </div>
        <Link  className="a"  to="/tutteur/createStagiaire">Ajouter Un Stagiaire</Link>
        </div>
    </>
            )
}




