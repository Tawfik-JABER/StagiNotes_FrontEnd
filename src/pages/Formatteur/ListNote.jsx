import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, LinearProgress } from "@mui/material";

import profile from "../../images/profile_pic.png";

import "../../styles/dashboard.css";

import FormatteurSideBar from "../../components/FormatteurSideBar";

const ListNote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    filliereId: "",
    annee: "",
    group: "",
    moduleId: "",
    controleType: "",
  });
  const [fillieres, setFillieres] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [groups, setGroups] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageProfilUrl, setImageProfilUrl] = useState(null);

  useEffect(() => {
    const affiche = async () => {
      const accesToken = localStorage.getItem("Token_Form");
      if (
        accesToken === "undefined" ||
        accesToken === null ||
        accesToken === 0 ||
        accesToken === false
      ) {
        navigate("/tutteur/login");
      }
      try {
        await axios({
          method: "get",
          url: "http://localhost:8000/api/formatteur/",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        }).then((res) => {
          setImageProfilUrl(res.data.data.image_url);
        });
      } catch (error) {
        console.error(error);
      }
    };
    affiche();
  }, []);
  const [modules, setModules] = useState([]);  // State to store filtered modules
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === "filliereId") {
      // Fetch the filtered modules when a filliere is selected
      if (value) {
        const accessToken = localStorage.getItem("Token_Form");
        try {
          const modulesResponse = await fetch(`http://localhost:8000/api/formatteur/modules-by-filliere/${value}`, {
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + accessToken,
              },
            });
          const modulesData = await modulesResponse.json();
          setModules(modulesData); // Update modules dropdown
  
          const groupsResponse = await fetch(`http://localhost:8000/api/formatteur/groups-by-filliere/${value}`, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + accessToken,
            },
          });
          const groupsData = await groupsResponse.json();
          setGroups(groupsData); // Update groups dropdown
        } catch (error) {
          console.error("Error fetching modules or groups:", error);
        }
      } else {
        setModules([]); // Reset modules if no filliere is selected
        setGroups([]); // Reset groups if no filliere is selected
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("Token_Form");
    axios
      .get("http://localhost:8000/api/formatteur/form_data", {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        const data = response.data;
        setFillieres(data.fillieres);
        setAnnees(data.annees);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleNoteInputChange = (stagiaireId) => (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [stagiaireId]: String(value),
      },
    }));
  };

  const [loadingFetchNotes, setLoadingFetchNotes] = useState(false)
  
  const handleSubmit = (event) => {
    setLoadingFetchNotes(true)
    event.preventDefault();
    const accessToken = localStorage.getItem("Token_Form");
    axios
      .post(
        "http://localhost:8000/api/formatteur/stagiaires",
        {
          filliereId: formData.filliereId,
          annee: formData.annee,
          group: formData.group,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((response) => {
        setLoadingFetchNotes(false)
        const data = response.data;
        setStagiaires(data);
      })
      .catch((error) => {
        console.log(error)
        setLoadingFetchNotes(false)
      });
  };

  const[loadingAdd, setLoadingAdd] = useState(false)

  const handleBatchSubmit = async () => {
    setIsSubmitting(true); // Prevent multiple submissions
    setLoadingAdd(true)
    const promises = stagiaires.map((stagiaire) =>
      handleNoteSubmit(stagiaire.id, formData.moduleId)()
    );
  
    // Wait for all requests to complete before reloading
    await Promise.all(promises);
    setLoadingAdd(false)
    // Reload the page after all API calls finish
    window.location.reload();
  };
  
  const handleNoteSubmit = (stagiaireId, moduleId) => (event) => {
    // event.preventDefault();
    const noteFieldName = `note-${stagiaireId}`;
    const noteValue = formData[noteFieldName][stagiaireId] || "";
    const note = parseFloat(noteValue);
    const { controleType } = formData;
    const accessToken = localStorage.getItem("Token_Form");
    return axios
      .post(
        "http://localhost:8000/api/formatteur/store_note",
        {
          note,
          stagiaireId,
          moduleId,
          controleType,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        // Handle any success/failure logic or show a success message to the user
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <FormatteurSideBar />
      <div className="content">
        <div className="nav">
          <div class="input-with-icon"></div>
          <div>
            <Link to="/formatteur/profile">
            {
            imageProfilUrl ?
            (<img src={`http://127.0.0.1:8000/${imageProfilUrl}`} alt="Profile" />)
            :
            (<img src={profile} alt="Profile" />)
            }
            </Link>
          </div>
        </div>
        <h4 className="h4" style={{ margin: "-50px 60px -20px" }}>
          Stagiaire Note Form
        </h4>
        <form className="form" onSubmit={handleSubmit}>
          <div className="div">
            <label>Filliere</label> <br />
            <select name="filliereId" onChange={handleInputChange} required>
              <option value="">Select Filliere</option>
              {fillieres.map((filliere) => (
                <option key={filliere.id} value={filliere.id}>
                  {filliere.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="div">
            <label>Annee</label> <br />
            <select name="annee" onChange={handleInputChange} required>
              <option value="">Select Annee</option>
              {annees.map((annee) => (
                <option key={annee.id} value={annee.id}>
                  {annee.annee}
                </option>
              ))}
            </select>
          </div>
          <div className="div">
            <label>Group</label> <br />
            <select name="group" onChange={handleInputChange} required>
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group}
                </option>
              ))}
            </select>
          </div>
          <div className="div">
          <label>Module</label> <br />
            <select name="moduleId" onChange={handleInputChange} required>
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="div">
            <label>Controle Type</label> <br />
            <select name="controleType" onChange={handleInputChange} required>
              <option value="">Select Controle Type</option>
              <option value="PremierControle">Premier Controle</option>
              <option value="DeuxiemControle">Deuxieme Controle</option>
              <option value="TroisiemControle">Troisiem Controle</option>
              <option value="EFM">E.F.M</option>
            </select>
          </div>
          <button type="submit">
            {loadingFetchNotes ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> :'Affiche'}
          </button>
        </form>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th scope="col">Nom et Prenom</th>
                <th scope="col">Note</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((stagiaire) => (
                <tr key={stagiaire.id}>
                  <td scope="row">{stagiaire.id}</td>
                  <td>
                    {stagiaire.nom} {stagiaire.prenom}
                  </td>
                  <td>
                    <input
                      required
                      type="number"
                      name={`note-${stagiaire.id}`}
                      onChange={handleNoteInputChange(stagiaire.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loadingFetchNotes ? <LinearProgress /> : ''}
        </div>
        <button
          className="bttn"
          onClick={handleBatchSubmit}
          disabled={isSubmitting}
        >
          {loadingAdd ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : 'Submit All Notes'}
        </button>
      </div>
    </>
  );
};

export default ListNote;
