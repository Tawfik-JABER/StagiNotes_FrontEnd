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


export default function CreateStagiaire() {
    //--------------------------------------- Check the token
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/tutteur/login')
        }
    })
    const navigate = useNavigate();

    const [cin,setCin]= useState("")
    const [nom,setNom]= useState("")
    const [prenom,setPrenom]= useState("")
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [fill_id,setFill_id]= useState("")
    const [numero,setNumero]= useState("")
    const [cef,setCef]= useState("")
    const [group,setGroup]= useState("")
    const [annee,setAnnee]= useState("")
    const [niveau,setNiveau]= useState("")
    const [sexe,setSexe]= useState("")
    const [filieres,setFilieres] = useState([])
    
    const handleSelectChange1 = (event) => {
      setFill_id(event.target.value);
    };
    
    const handleSelectChange2 = (event) => {
      setNiveau(event.target.value);
    };


    useEffect(() => {
        fetchStagiaires();
    },[])
    const fetchStagiaires = async() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        try{
            await axios.get(`http://localhost:8000/api/tutteur/showStagiaires`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                console.log(data)
                setFilieres(data.filieres)
            })
        }catch(error){
            console.log(error)
        }
    }


    const createStagiaire = async(e) => {
        const accesToken = localStorage.getItem('Token_Tutt');
        e.preventDefault();
        const formData = new FormData();
        formData.append("cin",cin); formData.append("nom",nom)
        formData.append("prenom",prenom); formData.append("email",email)
        formData.append("password",password); formData.append("fill_id",fill_id)
        formData.append("numero",numero); formData.append("cef",cef)
        formData.append("group",group); formData.append("annee",annee)
        formData.append("niveau",niveau); formData.append("sexe",sexe)
        await axios.post("http://localhost:8000/api/tutteur/addStagiaire",formData, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
        .then(({data})=> {
            console.log(data.message)
            navigate("/tutteur/listStagiaire")
        }).catch(({response})=>{
            if (response.status == 422){
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        })
    }
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

                </div>
                <div>
                    <Link to="/director/profile">
                        <img src={profile} alt="" />
                    </Link>
                </div>
            </div>
        <h4 className="h4" style={{margin:"-50px 60px -20px"}}>Créer Un Stagiaire</h4>
        <form action="" onSubmit={createStagiaire} className="form">
            <div className="div">
                <label htmlFor="">Cin</label> <br />
                <input type="text" placeholder="CIN De Formatteur" value={cin} onChange={(e)=>{setCin(e.target.value)}} />
            </div>
            <div className="div">
                <label htmlFor="">Nom</label> <br />
                <input type="text" placeholder="Nom De Formatteur" value={nom} onChange={(e)=>{setNom(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">Prenom</label> <br />
                <input type="text" placeholder="Prenom De Formatteur" value={prenom} onChange={(e)=>{setPrenom(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">Email</label> <br />
                <input type="email" placeholder="Email De Formatteur" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="" >Password</label> <br />
                <input type="password" placeholder="Password De Formatteur" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="" >Filiere</label> <br />
                <select value={fill_id} onChange={handleSelectChange1}>
                    <option value="" disabled selected> choisir un filiere</option>
                    {filieres.map((filliere) => (
                        <option key={filliere.id} value={filliere.id}>
                        {filliere.nom}
                        </option>
                    ))}
                </select>
            </div>
            <div className="div">
                <label htmlFor="">Numéro</label> <br />
                <input type="text" value={numero} onChange={(e)=>{setNumero(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">CEF</label> <br />
                <input type="text" value={cef} onChange={(e)=>{setCef(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">Group</label> <br />
                <input type="text" value={group} onChange={(e)=>{setGroup(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">Année</label> <br />
                <input type="text" placeholder="1 ou 2" value={annee} onChange={(e)=>{setAnnee(e.target.value)}}/>
            </div>
            <div className="div">
                <label htmlFor="">Niveau</label> <br />
                <select value={niveau} onChange={handleSelectChange2}>
                    <option value="Technicien Spécialisé">Technicien Spécialisé</option>
                    <option value="Technicien">Technicien</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Spécialisation">Spécialisation</option>
                </select>
            </div>
            <div className="div">
                <label htmlFor="">Sexe</label> <br />
                <input type="text" value={sexe} onChange={(e)=>{setSexe(e.target.value)}}/>
            </div>
            <button type="submit">Ajouter</button>
        </form>
    </div>
    </>
    );
  }