import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";

import TutteurSideBar from "../../../components/TutteurSideBar";
import { Alert, CircularProgress } from "@mui/material";

export default function UpdateFormatteurFiliereModule() {

  useEffect(() => {
    const affiche = async () => {
      const accesToken = localStorage.getItem("Token_Tutt");
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
          url: "http://localhost:8000/api/tutteur/",
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageProfilUrl, setImageProfilUrl] = useState(null);

  // pour la formulaire
  const [modules, setModules] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [formatteurs, setFormatteurs] = useState([]);

  const [formateur_id, setFormateur_id] = useState("");
  const [filliere_id, setFilliere_id] = useState("");
  const [module_id, setModule_id] = useState("");
  // set values for id
  const handleSelectChange1 = (event) => {
    setFormateur_id(event.target.value);
  };

  const handleSelectChange2 = (event) => {
    setFilliere_id(event.target.value);
  };
  const handleSelectChange3 = (event) => {
    setModule_id(event.target.value);
  };
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [loading,setLoading] = useState(false)
  const accesToken = localStorage.getItem("Token_Tutt");
  //  --------------------------------------- Create
  const updateFormatteurFiliereModule = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("formateur_id", formateur_id);
    formData.append("filliere_id", filliere_id);
    formData.append("module_id", module_id);
    await axios
      .post(
        `http://localhost:8000/api/tutteur/updateFormatteurFiliereModule/${id}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        }
      )
      .then(({ data }) => {
        setLoading(false)
        setAlertMessage(data.message);
        if (data.success) {
          setAlertSeverity("success");
        } else {
          setAlertSeverity("error");
        }
        console.log(data.message);
        setTimeout(
          () => navigate("/tutteur/listFormatteurFiliereModule"),
          1000
        );
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.success === false) {
          navigate("/tutteur/listFormatteurFiliereModule");
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
        }
      });
  };
  useEffect(() => {
    const accesToken = localStorage.getItem("Token_Tutt");
    if (
      accesToken === "undefined" ||
      accesToken === null ||
      accesToken === 0 ||
      accesToken === false
    ) {
      navigate("/tutteur/login");
    }
    fetchFormatteurFiliereModules();
  }, []);
  //  --------------------------------------- Show
  const fetchFormatteurFiliereModules = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showFormatteurFiliereModules`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data);
          setModules(data.modules);
          setFormatteurs(data.formatteurs);
          setFilieres(data.filieres);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TutteurSideBar />
      <div className="content">
        <div className="nav">
          <div class="input-with-icon">Modifier Un enseignant</div>
          <div>
            <Link to="/tutteur/profile">
            {
            imageProfilUrl ?
            (<img src={`http://127.0.0.1:8000/${imageProfilUrl}`} alt="Profile" />)
            :
            (<img src={profile} alt="Profile" />)
            }
            </Link>
          </div>
        </div>
          {alertMessage && (
            <Alert severity={alertSeverity} style={{ marginTop: "20px" }}>
              {alertMessage}
            </Alert>
          )}
        <form
          action=""
          onSubmit={updateFormatteurFiliereModule}
          className="form"
          style={{ margin: "100px 60px 20px" }}
        >
          <div className="div">
            <label htmlFor="formateur">Formatteur</label> <br />
            <select
              required
              id="formateur"
              value={formateur_id}
              onChange={handleSelectChange1}
            >
              <option value="">-- Sélectionner un formateur --</option>
              {formatteurs && formatteurs.length > 0 ? (
                formatteurs.map((formatteur) => (
                  <option key={formatteur.id} value={formatteur.id}>
                    {formatteur.nom}
                  </option>
                ))
              ) : (
                <option disabled>Aucun formateur disponible</option>
              )}
            </select>
          </div>
          <div className="div">
            <label htmlFor="fillier">Filiere</label> <br />
            <select
              required
              id="fillier"
              value={filliere_id}
              onChange={handleSelectChange2}
            >
              <option value="">-- Sélectionner un fillier --</option>
              {filieres && filieres.length > 0 ? (
                filieres.map((filliere) => (
                  <option key={filliere.id} value={filliere.id}>
                    {filliere.nom}
                  </option>
                ))
              ) : (
                <option disabled>Aucun formateur disponible</option>
              )}
            </select>
          </div>
          <div className="div">
            <label htmlFor="module">Module</label> <br />
            <select
              required
              id="module"
              value={module_id}
              onChange={handleSelectChange3}
            >
              <option value="">-- Sélectionner un module --</option>
              {modules && modules.length > 0 ? (
                modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.nom}
                  </option>
                ))
              ) : (
                <option disabled>Aucun formateur disponible</option>
              )}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Modifier"}
          </button>
        </form>
      </div>
    </>
  );
}
