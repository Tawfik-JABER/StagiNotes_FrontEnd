import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import logo from "../../images/ofppt.png"
import profile from "../../images/profile.png"
import profille from "../../images/profille.svg"
import tutteur from "../../images/tutteur.svg"
import home from "../../images/home.svg"
import stagiaire from "../../images/stagiaire.svg"
import module from "../../images/module.svg"
import formatteur from "../../images/formatteur.svg"
import filier from "../../images/filier.svg"
import log_out from "../../images/logout.svg"
import plan from "../../images/plan.svg"
import note from "../../images/note.svg"


import "../../styles/dashboard.css"
const NoteStagiaireTutt = () => {
  const [id, setId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate()

  const handleIdChange = (event) => {
    setId(event.target.value);
  };
  useEffect(() => {
    const accesToken = localStorage.getItem('Token_Tutt');
    if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
        navigate('/tutteur/login')
    }
    fetchstagiaire();
},[])

  const fetchstagiaire = async() => {
    const accesToken = localStorage.getItem('Token_Tutt');
    try{
        await axios.get(`http://localhost:8000/api/tutteur/showStagiaireInfo`, {
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
  };


  useEffect(() => {
    fetchData();
},[])
    const fetchData = async() => {
    const accesToken = localStorage.getItem('Token_Tutt');
    try{
    await axios.get(`http://localhost:8000/api/tutteur/showStagiaireNotes?id=${id}`,{
        headers : {
            "Accept": "application/json",
            "Authorization": 'Bearer ' + accesToken 
        }})
        .then(({ data })=> {
        console.log(data)
        setTableData(data.notes)
        setShowTable(true)
    })}catch(error){
        console.log(error)
    }}
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
                  <div>
                      <p className='image'>
                          <img src={module} alt="" />
                      </p>
                      <Link to="/tutteur/listAbsence">les Absences</Link>
                  </div>
                  <div   className="focus">
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
  <h4 className="h4" style={{margin:"-50px 60px -20px"}}>Chercher des Notest</h4>
    <div className='form' style={{margin:"140px 60px 20px"}}>
      <div className="div" >
          <label htmlFor="">Stagiaire</label> <br />
          <select value={id} onChange={handleIdChange}>
            <option value="" disabled>Select an option</option>
            {stagiaires.map((stagiaire) => (
              <option key={stagiaire.id} value={stagiaire.id}>
                {stagiaire.nom} {stagiaire.prenom} | CEF : {stagiaire.cef}
                </option>
            ))}
            </select>
      </div>
      <button onClick={fetchData}>Afficher</button>
    </div>
  <div className="overflow">
  {showTable && (
  <table class="table table-striped">
      <thead>
          <tr>
            <th scope='col'>Module</th>
            <th scope='col'>Premier Controle</th>
            <th scope='col'>Deuxieme Controle</th>
            <th scope='col'>Troisieme Controle</th>
            <th scope='col'>Efm</th>
            <th scope='col'>Note Generale</th>
          </tr>
      </thead>
      <tbody>
      {tableData.map((item, index) => (
            <tr key={index}>
              <td scope='row'>{item.module}</td>
              <td>{item.premierControle}</td>
              <td>{item.deuxiemeControle}</td>
              <td>{item.troisiemeControle}</td>
              <td>{item.efm}</td>
              <td>{item.noteGenerale}</td>
            </tr>
          ))}
      </tbody>
  </table>)}
  </div>
</div>
</>
)
};

export default NoteStagiaireTutt;
