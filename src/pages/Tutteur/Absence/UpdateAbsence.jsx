import React,{useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams,Link}  from "react-router-dom";
import { Alert } from "@mui/material";
import logo from "../../../images/ofppt.png"
import profile from "../../../images/profile.png"
import profille from "../../../images/profille.svg"
import home from "../../../images/home.svg"
import stagiaire from "../../../images/stagiaire.svg"
import module from "../../../images/module.svg"
import filier from "../../../images/filier.svg"
import log_out from "../../../images/logout.svg"
import plan from "../../../images/plan.svg"
import note from "../../../images/note.svg"


import "../../../styles/dashboard.css"

export default function UpdateAbsence() {
    //--------------------------------------- Check the token
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/tutteur/login')
        }
    })
    // 'stagiaire_id',
    // 'durrée',
    // 'date',
    // 'justifié'
    const {id} = useParams();
    const navigate = useNavigate();
    
    // pour la formulaire
    const [stagiaires,setStagiaires]= useState([])

    const[stagiaire_id,setStagiaire_id]= useState("")
    const[durrée,setDurrée]= useState("")
    const[date,setDate]= useState("")
    const[justifié,setJustifié]= useState("")
    // set values for id
    const handleSelectChange1 = (event) => {
        setStagiaire_id(event.target.value);
    };
    const handleSelectChange2 = (event) => {
        setJustifié(event.target.value);
    };
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    useEffect(() => {
        fetchAbsence();
    },[])
    //  --------------------------------------- Show 
    const fetchAbsence = async() => {
            await axios.get(`http://localhost:8000/api/tutteur/showAbsence/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + accesToken 
                }})
            .then(({ data })=> {
                console.log(data)
                setDate(data.absence.date)
                setJustifié(data.absence.justifié)
                setDurrée(data.absence.durrée)
                setStagiaires(data.stagiaires)
            }).catch(({response: {data}}) =>{
                console.log(data.message)
            })
        
    }
    const accesToken = localStorage.getItem('Token_Tutt');
    //  --------------------------------------- Create 
    const updateAbsence = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("stagiaire_id",stagiaire_id)
        formData.append("durrée",durrée)
        formData.append("date",date)
        formData.append("justifié",justifié)
        await axios.post(`http://localhost:8000/api/tutteur/updateAbsence/${id}`,formData, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
            .then(({data})=> {
                setAlertMessage(data.message);
                if(data.success) {
                    setAlertSeverity('success');
                } else {
                    setAlertSeverity('error');
                }
                console.log(data.message)
                setTimeout(() => navigate("/tutteur/listAbsence"), 1000);
            }).catch(({response})=>{
                if (response.success === false){
                    navigate("/tutteur/listAbsence")
                    console.log(response.data.errors)
                } else {
                    console.log(response.data.message)
                }
        })
    }
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
                    <div>
                        <p className='image'>
                            <img src={plan} alt="" />
                        </p>
                        <Link to="/tutteur/listStagiaireModule">planification</Link>
                    </div>
                    <div  className="focus">
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
    <h4 className="h4" style={{margin:"100px 60px -20px"}}>Modifier Un enseignant</h4>
    {alertMessage && <Alert style={{marginTop:"20px"}} severity={alertSeverity}>{alertMessage}</Alert>}
    <form action="" onSubmit={updateAbsence} className="form" style={{margin:"100px 60px 20px"}}>
        <div className="div">
            <label htmlFor="">Stagiaire</label> <br />
            <select value={stagiaire_id} onChange={handleSelectChange1}>
                <option value="" disabled>Select an option</option>
                {stagiaires.map((stagiaire) => (
                    <option key={stagiaire.id} value={stagiaire.id}>
                    {stagiaire.nom}  {stagiaire.prenom}
                    </option>
                ))}
            </select>
        </div>
        <div className="div">
            <label htmlFor="">Durrée</label> <br />
            <input type="text" value={durrée} onChange={(e)=>{setDurrée(e.target.value)}} />
        </div>
        <div className="div">
            <label htmlFor="">Date</label> <br />
            <input type="date" value={date} onChange={(e)=>{setDate(e.target.value)}}/>
        </div>
        <div className="div">
            <label htmlFor="">Justification</label> <br />
            <select value={justifié} onChange={handleSelectChange2}>
            <option value="" disabled>Select an option</option>
            <option value="L' absence justifiée">L' absence justifiée</option>
            <option value="L' absence injustifiée">L' absence injustifiée</option>
        </select>
        </div>
        <button type="submit">Modifier</button>
    </form>
</div>
</>
)
}




