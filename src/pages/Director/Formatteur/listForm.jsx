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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../../styles/dashboard.css"

export default function ListForm() {
    //--------------------------------------- Check the token 

    const navigate = useNavigate();
    const [formatteurs,setFormatteurs]= useState([])
    const [searchTerm, setSearchTerm] = useState('');

    
    const accesToken = localStorage.getItem('Token_dir');

    useEffect(() => {
        const accesToken = localStorage.getItem('Token_dir');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
        fetchFormatteurs();
    },[])
    const fetchFormatteurs = async() => {
        try{
            await axios.get(`http://localhost:8000/api/director/showFormatteurs`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                setFormatteurs(data.formatteurs)
                console.log(formatteurs)
            })
        }catch(error){
            console.log(error)
        }
    };
    // --------------------------- Search Input -----------
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const filteredFormatteurs = formatteurs.filter((formatteur) => {
        const fullName = formatteur.nom + ' ' + formatteur.prenom;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    // --------------------------- Search Input -----------

    const deleteFormatteur = async(id) => {
        /* eslint-disable no-restricted-globals */
        const confirmed = confirm(`tu peux suprimer ce Formatteur avec id ${id}`)
        if (confirmed) {
            await axios.delete(`http://localhost:8000/api/director/deleteFormatteur/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
                .then(({data})=> {
                    console.log(data.message)
            fetchFormatteurs()
        }).catch(({response: {data} })=>{
            console.log(data.message)
            if (data.status == 422){
                console.log(data.errors)
            }
        })
    }
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
                <div className='focus'>
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
        <h4 className="h4">Les Formatteurs</h4>
        <div className="overflow">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Cin</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Prenom</th>
                    <th scope="col">email</th>
                    <th scope="col">Sexe</th>
                    <th scope="col" colspan="2">            </th>
                </tr>
            </thead>
            <tbody>
                {
                formatteurs &&(
                    filteredFormatteurs.map((row, key) => (
                        <tr key={key}>
                            <td scope="row">{row.cin}</td>
                            <td>{row.nom}</td>
                            <td>{row.prenom}</td>
                            <td>{row.email}</td>
                            <td>{row.sexe}</td>
                            <td style={{cursor:"pointer"}}>
                                <FontAwesomeIcon onClick={() => deleteFormatteur(row.id)} icon={faTrash} />
                            </td>
                            <td>
                                <Link to={`/director/updateFormatteur/${row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                            </td>
                            </tr>
                        ))
                        )
                    }
            </tbody>

        </table>
        </div>
        <Link  className="a"  to="/director/createFormatteur">Ajouter Un Formatteur</Link>
    </div>
    </>
    )
}