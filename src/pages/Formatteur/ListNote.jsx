import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../../images/ofppt.png"
import profile from "../../images/profile.png"
import profille from "../../images/profille.svg"
import formatteur from "../../images/tutteur.svg"
import home from "../../images/home.svg"
import stagiaire from "../../images/stagiaire.svg"
import module from "../../images/module.svg"
import filier from "../../images/filier.svg"
import log_out from "../../images/logout.svg"
import note from "../../images/note.svg"


import "../../styles/dashboard.css"

const ListNote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    filliereId: '',
    annee: '',
    group: '',
    moduleId: '',
    controleType: '',
  });
  const [fillieres, setFillieres] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  useEffect(() => {
    const accessToken = localStorage.getItem('Token_Form');
    if (accessToken === "undefined" || accessToken === null || accessToken === 0 || accessToken === false) {
      navigate('/formatteur/login');
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('Token_Form');
    axios.get('http://localhost:8000/api/formatteur/form_data', {
      headers: {
        "Accept": "application/json",
        "Authorization": 'Bearer ' + accessToken
      }
    })
      .then(response => {
        const data = response.data;
        setFillieres(data.fillieres);
        setAnnees(data.annees);
        setGroups(data.groups);
        setModules(data.modules);
        console.log(data.annees);
        console.log(data.groups);
      })
      .catch(error => console.log(error));
  }, []);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleNoteInputChange = stagiaireId => event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [stagiaireId]: String(value)
      }
    }));
  };
  // const handleNoteInputChange = stagiaireId => event => {
  //   const { name, value } = event.target;
  //   setFormData(prevState => ({
  //     ...prevState,
  //     [name]: {
  //       ...prevState[name],
  //       [stagiaireId]: value
  //     }
  //   }));
  // };

  const handleSubmit = event => {
    event.preventDefault();
    const accessToken = localStorage.getItem('Token_Form');
    axios.post('http://localhost:8000/api/formatteur/stagiaires', {
      filliereId: formData.filliereId,
      annee: formData.annee,
      group: formData.group,
    }, {
      headers: {
        "Accept": "application/json",
        "Authorization": 'Bearer ' + accessToken
      }
    })
      .then(response => {
        const data = response.data;
        setStagiaires(data);
      })
      .catch(error => console.log(error));
  };

  const handleBatchSubmit = () => {
    setIsSubmitting(true); // Set the submission flag to true
    stagiaires.forEach(stagiaire => {
      handleNoteSubmit(stagiaire.id, formData.moduleId)();
    });
    setTimeout(() => {
      window.location.reload()
    }, 5000);
  };
  const handleNoteSubmit = (stagiaireId, moduleId) => event => {
    // event.preventDefault();
    const noteFieldName = `note-${stagiaireId}`;
    const noteValue = formData[noteFieldName][stagiaireId] || ''
    const note = parseFloat(noteValue);
    const { controleType } = formData;
    const accessToken = localStorage.getItem('Token_Form');
    console.log(noteFieldName);
    console.log(note);
    axios.post('http://localhost:8000/api/formatteur/store_note', {
      note,
      stagiaireId,
      moduleId,
      controleType,
    }, {
      headers: {
        "Accept": "application/json",
        "Authorization": 'Bearer ' + accessToken
      }
    })
      .then(response => {
        const data = response.data;
        // Handle any success/failure logic or show a success message to the user
      })
      .catch(error => console.log(error));
  };
  const logout = () => {
    const accesToken = localStorage.getItem("Token_Form");
    if (accesToken === "undefined" || accesToken === null || accesToken === 0) {
            navigate('/formatteur/login')
        }
        try {
            axios({
            method: 'delete',
            url: 'http://localhost:8000/api/formatteur/logout',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + accesToken
            }
        })
        }catch(error) {
            console.log(error);
        }

        localStorage.removeItem("Token_Form");
        navigate('/formatteur/login')
    }
return (
    <>
        <div className='side_bar'>
            <div className='image_ofppt' >
                <img src={logo} alt="" />
            </div>
            <div className='section'>
                <div   className="focus" style={{marginTop:"-200px"}}>
                    <p className='image'>
                    <img src={note} alt="" />
                    </p>
                    <Link to="/formatteur/listNote">les Notes</Link>
                </div>
                <div>
                    <p className='image'>
                    <img src={profille} alt="" />
                    </p>
                    <Link to="/formatteur/profile">Profile</Link>
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
                    <Link to="/formatteur/profile">
                        <img src={profile} alt="" />
                    </Link>
                </div>
            </div>
<h4 className="h4" style={{margin:"-50px 60px -20px"}}>Stagiaire Note Form</h4>
<form className='form' onSubmit={handleSubmit}>
    <div className="div" >
      <label>Filliere</label> <br />
      <select name="filliereId" onChange={handleInputChange} required>
          <option value="">Select Filliere</option>
          {fillieres.map(filliere => (
            <option key={filliere.id} value={filliere.id}>
              {filliere.nom}
            </option>
          ))}
        </select>
    </div>
    <div className="div" >
    <label>Annee</label> <br />
    <select name="annee" onChange={handleInputChange} required>
          <option value="">Select Annee</option>
          {annees.map(annee => (
            <option key={annee.id} value={annee.id}>
              {annee.annee}
            </option>
          ))}
        </select>
    </div>
    <div className="div" >
    <label>Group</label> <br />
    <select name="group" onChange={handleInputChange} required>
          <option value="">Select Group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.group}
            </option>
          ))}
        </select>
    </div>
    <div className="div" >
    <label>Module</label> <br />
    <select name="moduleId" onChange={handleInputChange} required>
          <option value="">Select Module</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.nom}
            </option>
          ))}
        </select>
    </div>
    <div className="div" >
    <label>Controle Type</label> <br />
        <select name="controleType" onChange={handleInputChange} required>
          <option value="">Select Controle Type</option>
          <option value="premier_controles">Premier Controle</option>
          <option value="deuxieme_controles">Deuxieme Controle</option>
          <option value="troisiem_controles">Troisiem Controle</option>
          <option value="efms">E.F.M</option>
        </select>
    </div>
    <button type="submit">Affiche</button>
    </form>
<div className="overflow">
<table class="table table-striped">
    <thead>
        <tr>
        <th>ID</th>
            <th scope='col'>Nom et Prenom</th>
            <th scope='col'>Note</th>
            <th scope='col' hidden>Submit</th>
        </tr>
    </thead>
    <tbody>
    {stagiaires.map(stagiaire => (
            <tr key={stagiaire.id}>
            <td scope='row'>{stagiaire.id}</td>
            <td>{stagiaire.nom} {stagiaire.prenom}</td>
            <td>
              <input
                type="text"
                name={`note-${stagiaire.id}`}
                onChange={handleNoteInputChange(stagiaire.id)}
              />
            </td>
            <td>
              <button hidden onClick={handleNoteSubmit(stagiaire.id, formData.moduleId)}>
                Submit Note
              </button>
            </td>
          </tr>
        ))}
    </tbody>
</table>
</div>
    <button className='bttn' onClick={handleBatchSubmit} disabled={isSubmitting}>
      Submit All Notes
    </button>
</div>
  </>

)
};

export default ListNote;