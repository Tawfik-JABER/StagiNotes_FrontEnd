import React,{useEffect, useState} from "react";
import axios from "axios";
import { Link, useNavigate,useParams } from 'react-router-dom';
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



import "../../../styles/dashboard.css"
import Alert from '@mui/material/Alert';

export default function UpdateModule() {
    //--------------------------------------- Check the token 
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_Tutt');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
    },[])
    const accesToken = localStorage.getItem('Token_Tutt');
    const {id} = useParams();

    const navigate = useNavigate();

    const[nom,setNom]= useState("")
    const[code,setCode]= useState("")
    const[coefficient,setCoefficient]= useState("")

    //--------------------------------------------- alertMessage
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    useEffect(() => {
        fetchModule();
    },[])
    const fetchModule = async() => {
        await axios.get(`http://localhost:8000/api/tutteur/showModule/${id}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
        .then(({ data })=> {
            setCode(data.module.code)
            setNom(data.module.nom)
            setCoefficient(data.module.coefficient)
        }).catch(({response: {data}})=>{
            console.log(data.message)
        })
    }
    const updateModule = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("code",code)
        formData.append("nom",nom)
        formData.append("coefficient",coefficient)
        await axios.post(`http://localhost:8000/api/tutteur/updateModule/${id}`,formData, {
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
            setTimeout(() => navigate("/tutteur/listModule"), 1000);
        }).catch(({response})=>{
            if (response.success === false){
                navigate("/tutteur/listModule")
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
                    <div>

                    </div>
                    <div>
                        <Link to="/director/profile">
                            <img src={profile} alt="" />
                        </Link>
                    </div>
                </div>
            <h4 className="h4" style={{margin: "111px 60px -20px"}}>Modifier Un Module</h4>
            {alertMessage && <Alert severity={alertSeverity} style={{marginTop:"20px"}}>{alertMessage}</Alert>}
            <form action="" onSubmit={updateModule} className="form" style={{margin:"100px 60px 20px"}}>
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
                <button type="submit">Modifier</button>
            </form>
</div>
</>
)
}