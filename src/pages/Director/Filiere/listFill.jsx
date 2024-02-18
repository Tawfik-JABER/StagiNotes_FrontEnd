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

export default function ListFill() {
    //--------------------------------------- Check the token 

    const navigate = useNavigate();
    const [filieres,setFiliers]= useState([])
    const [searchTerm, setSearchTerm] = useState('');

    
    const accesToken = localStorage.getItem('Token_dir');

    useEffect(() => {
        const accesToken = localStorage.getItem('Token_dir');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
        fetchFilliers();
    },[])
    const fetchFilliers = async() => {
        try{
            await axios.get(`http://localhost:8000/api/director/showFilieres`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                setFiliers(data.filieres)
                console.log(filieres)
            })
        }catch(error){
            console.log(error)
        }
    }
    // --------------------------- Search Input -----------
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const filteredFilieres = filieres.filter((filiere) => {
        const NomFilier = filiere.nom ;
        return NomFilier.toLowerCase().includes(searchTerm.toLowerCase());
    });
    // --------------------------- Search Input -----------
    const deleteFiliere = async(id) => {
        /* eslint-disable no-restricted-globals */
        const confirmed = confirm(`tu peux suprimer ce Filliere avec id ${id}`)
        if (confirmed) {
            await axios.delete(`http://localhost:8000/api/director/deleteFiliere/${id}`, {
                headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
        .then(({data})=> {
            console.log(data.message)
            fetchFilliers()
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
                <div  className='focus'>
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
        <h4 className="h4">Les Filieres</h4>
        <div className="overflow">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Description</th>
                    <th scope="col" colspan="2">            </th>
                </tr>
            </thead>
            <tbody>
                {
                filieres &&(
                    filteredFilieres.map((row, key) => (
                        <tr key={key}>
                            <td scope="row">{row.id}</td>
                            <td>{row.nom}</td>
                            <td>{row.description}</td>
                            <td style={{cursor:"pointer"}}>
                                <FontAwesomeIcon onClick={() => deleteFiliere(row.id)} icon={faTrash} />
                            </td>
                            <td>
                                <Link to={`/director/updateFiliere/${row.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                            </td>
                            </tr>
                        ))
                        )
                    }
            </tbody>

        </table>
        </div>
        <Link className="a" to="/director/createFiliere">Ajouter Un Filiere</Link>
    </div>
    </>
    )
}




