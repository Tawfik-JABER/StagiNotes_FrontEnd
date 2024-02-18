import React,{useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, Link, useParams}  from "react-router-dom";
import logo from "../../../images/ofppt.png"
import profile from "../../../images/profile.png"
import profille from "../../../images/profille.svg"
import stagiaire from "../../../images/stagiaire.svg"
import module from "../../../images/module.svg"
import filier from "../../../images/filier.svg"
import log_out from "../../../images/logout.svg"
import plan from "../../../images/plan.svg"
import note from "../../../images/note.svg"



import "../../../styles/dashboard.css"

export default function UpdateStagiaireModule() {
    //--------------------------------------- Check the token
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/tutteur/login')
        }
    })
    const {id} = useParams();
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


    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    const accesToken = localStorage.getItem('Token_Tutt');
    //  --------------------------------------- Create 
    const updateStagiaireModule = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("stagiaire_id",stagiaire_id)
        formData.append("module_id",module_id)
        await axios.post(`http://localhost:8000/api/tutteur/updateStagiaireModule/${id}`,formData, {
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
                setTimeout(() => navigate("/tutteur/listStagiaireModule"), 1000);
            }).catch(({response})=>{
                if (response.success === false){
                    navigate("/tutteur/listStagiaireModule")
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
                    </div>
                        <div>
                            <Link to="/director/profile">
                                <img src={profile} alt="" />
                            </Link>
                        </div>
                    </div>
        <h4 className="h4" style={{margin:"111px 60px -20px"}}>Modifier Un enseignant</h4>
        <form action="" onSubmit={updateStagiaireModule} className="form" style={{margin:"100px 60px 20px"}}>
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
            <button type="submit">Modifier</button>
        </form>
    </div>
    </>
    )
}




