import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../images/ofppt.png"
import profile from "../../images/profile.png"
import profille from "../../images/profille.svg"
import home from "../../images/home.svg"
import stagiaire from "../../images/stagiaire.svg"
import module from "../../images/module.svg"
import filier from "../../images/filier.svg"
import log_out from "../../images/logout.svg"
import plan from "../../images/plan.svg"
import note from "../../images/note.svg"


import "../../styles/dashboard.css"

const SuiveNote = () => {
  const [tableData, setTableData] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [group, setGroup] = useState("");
  const [niveau, setNiveau] = useState("");
  const [nomfill, setNomFill] = useState("");
  const navigate = useNavigate()


  useEffect(() => {
    const accesToken = localStorage.getItem('Token_Stag');
    if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
        navigate('/stagiaire/login')
    }
},[])
useEffect(() => {
  const affiche = async () => {
      const accesToken = localStorage.getItem('Token_Stag');
      if (accesToken === "undefined" || accesToken === null || accesToken === 0 || accesToken === false) {
          navigate('/stagiaire/login')
      }
      try {
          await axios({
              method: "get",
              url: "http://localhost:8000/api/stagiaire",
              headers: {
                  "Accept": "application/json",
                  "Authorization": 'Bearer ' + accesToken
              }
          }).then((res) => {
              const data = res.data.data; // Get the array of objects
              if (data.length > 0) {
                  const firstStagiaire = data[0]; // Access the first object in the array
                  console.log(firstStagiaire.cin);
                  setNomFill(firstStagiaire.nomFill);
                  setGroup(firstStagiaire.group);
                  setNiveau(firstStagiaire.niveau);
              }
          });
      } catch(error){
      console.error(error);
  }
}
affiche();
}, [])



  useEffect(() => {
    fetchData();
},[])
    const fetchData = async() => {
    const accesToken = localStorage.getItem('Token_Stag');
    try{
    await axios.get(`http://localhost:8000/api/stagiaire/showNotes?`,{
        headers : {
            "Accept": "application/json",
            "Authorization": 'Bearer ' + accesToken 
        }})
        .then(({ data })=> {
        console.log(data)
        setTableData(data.notes)
        setStagiaires(data.stagiaires)
    })}catch(error){
        console.log(error)
    }}
    // ------------------------------------------- Log Out Function  ----------
    const logout = () => {
      const accesToken = localStorage.getItem("Token_Stag");
      if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
          navigate('/stagiaire/login')
      }
      try {
          axios({
              method: 'delete',
              url: 'http://localhost:8000/api/stagiaire/logout',
              headers: {
                  "Accept": "application/json",
                  "Authorization": 'Bearer ' + accesToken
              }
          })
      } catch (error) {
          console.log(error);
      }

      localStorage.removeItem("Token_Stag");
      navigate('/stagiaire/login')
  }
  return (
    <>
            <div className='side_bar'>
                <div className='image_ofppt' >
                    <img src={logo} alt="" />
                </div>
                <div className='section'>
                    <div style={{marginTop:"-200px"}}   className='focus'>
                        <p className='image'>
                        <img src={note} alt="" />
                        </p>
                        <Link to="/stagiaire/suiveNote">les Notes</Link>
                    </div>
                    <div>
                        <p className='image'>
                        <img src={profille} alt="" />
                        </p>
                        <Link to="/stagiaire/profile">Profile</Link>
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
                        <Link to="/stagiaire/profile">
                            <img style={{marginLeft:"0%"}} src={profile} alt="" />
                        </Link>
                    </div>
                </div>
                <div className='info' style={{marginTop:"100px"}}>
                        <h4>information personelle</h4>
                        <div className='data1'>
                            <div className='ligne'>
                                <div className='column'>
                                    <p className='p1'>Niveau d'etude</p>
                                    <p className='p2'>{niveau}</p>
                                </div>
                                <div className='column'>
                                    <p className='p1'>Filier</p>
                                    <p className='p2'>{nomfill}</p>
                                </div>
                            </div>
                            <div className='ligne'>
                                <div className='column'>
                                    <p className='p1'>L'institue</p>
                                    <p className='p2'>Ista Taourirt, ofppt</p>
                                </div>
                                <div className='column'>
                                    <p className='p1'>Group</p>
                                    <p className='p2'>{group}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="overflow">
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
                {tableData.map((row, key) => (
                        <tr key={key}>
                          <td scope='row'>{row.module}</td>
                          <td>{row.premierControle}</td>
                          <td>{row.deuxiemeControle}</td>
                          <td>{row.troisiemeControle}</td>
                          <td>{row.efm}</td>
                          <td>{row.noteGenerale}</td>
                            </tr>
                        ))}
            </tbody>

        </table>
        </div>






            </div>
    </>
  );
};

export default SuiveNote;
