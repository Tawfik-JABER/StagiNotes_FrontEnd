import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate,useParams,Link } from "react-router-dom";
import Alert from '@mui/material/Alert';
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


import "../../../styles/dashboard.css"

export default function UpdateForm() {
    //--------------------------------------- Check the token 
    useEffect(() => {
        const accesToken = localStorage.getItem('Token_dir');
        if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
            navigate('/director/login')
        }
    },[])
    const accesToken = localStorage.getItem('Token_dir');
    const {id} = useParams();
    
    const navigate = useNavigate();

    const [cin,setCin]= useState("")
    const [nom,setNom]= useState("")
    const [prenom,setPrenom]= useState("")
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [sexe,setSexe]= useState("")
    //--------------------------------------------- alertMessage
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    useEffect(() => {
        fetchTutteur();
    },[])
    
    const fetchTutteur = async() => {
        await axios.get(`http://localhost:8000/api/director/showFormatteur/${id}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken 
            }})
        .then(({data})=> {
            // const{cin,nom,prenom,email,password,sexe} = data.formatteur 
            setCin(data.formatteur.cin)
            setNom(data.formatteur.nom)
            setPrenom(data.formatteur.prenom)
            setEmail(data.formatteur.email)
            setSexe(data.formatteur.sexe)
        }).catch(({response: {data}})=>{
            console.log(data.message)
        })
    }
    const updateTutteur = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("cin",cin)
        formData.append("nom",nom)
        formData.append("prenom",prenom)
        formData.append("email",email)
        formData.append("password",password)
        formData.append("sexe",sexe)
        await axios.post(`http://localhost:8000/api/director/updateFormatteur/${id}`,formData, {
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
            setTimeout(() => navigate("/director/listFormatteur"), 1000);
        }).catch(({response})=>{
            if (response.success === false){
                navigate("/director/listTutteur")
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        })
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

                </div>
                <div>
                    <Link to="/director/profile">
                        <img src={profile} alt="" />
                    </Link>
                </div>
        </div>
        <h4 className="h4">Modifier Un Formatteur</h4>
        {alertMessage && <Alert severity={alertSeverity} style={{marginTop:"20px"}}>{alertMessage}</Alert>}
        <form action="" onSubmit={UpdateForm} className="form">
            <div>
                <label htmlFor="">Cin</label> <br />
                <input type="text" placeholder="CIN De Formatteur" value={cin} onChange={(e)=>{setCin(e.target.value)}} />
            </div>
            <div>
                <label htmlFor="">Nom</label> <br />
                <input type="text" placeholder="Nom De Formatteur" value={nom} onChange={(e)=>{setNom(e.target.value)}}/>
            </div>
            <div>
                <label htmlFor="">Prenom</label> <br />
                <input type="text" placeholder="Prenom De Formatteur" value={prenom} onChange={(e)=>{setPrenom(e.target.value)}}/>
            </div>
            <div>
                <label htmlFor="">Email</label> <br />
                <input type="email" placeholder="Email De Formatteur" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            </div>
            <div>
                <label htmlFor="" >Password</label> <br />
                <input type="password" placeholder="Password De Formatteur" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div>
                <label htmlFor="">Sexe</label> <br />
                <input type="text" placeholder="Sexe De Formatteur" value={sexe} onChange={(e)=>{setSexe(e.target.value)}}/>
            </div>
            <button type="submit">Modifier</button>
        </form>
    </div>
        </>
    );
}



