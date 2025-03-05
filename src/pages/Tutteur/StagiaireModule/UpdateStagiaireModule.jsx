import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";

import TutteurSideBar from "../../../components/TutteurSideBar";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";

export default function UpdateStagiaireModule() {
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const [loading, setLoading] = useState(false)
  
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

  // pour la formulaire
  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);

  const [stagiaire_id, setStagiaire_id] = useState("");
  const [module_id, setModule_id] = useState("");
  // set values for id
  const handleSelectChange1 = (event) => {
    setStagiaire_id(event.target.value);
  };

  const handleSelectChange2 = (event) => {
    setModule_id(event.target.value);
  };

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  const accesToken = localStorage.getItem("Token_Tutt");
  //  --------------------------------------- Create
  const updateStagiaireModule = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("stagiaire_id", stagiaire_id);
    formData.append("module_id", module_id);
    await axios
      .post(
        `http://localhost:8000/api/tutteur/updateStagiaireModule/${id}`,
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
        setTimeout(() => navigate("/tutteur/listStagiaireModule"), 1000);
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.success === false) {
          navigate("/tutteur/listStagiaireModule");
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
        }
      });
  };
  useEffect(() => {
    const accesToken = localStorage.getItem("Token_Tutt");
    if (!accesToken) {
      navigate("/tutteur/login");
    }
    fetchStagiaireModules();
  }, []);
  //  --------------------------------------- Show
  const fetchStagiaireModules = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showStagiaireModules`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data);
          setModules(data.modules);
          setStagiaires(data.stagiaires);
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
          onSubmit={updateStagiaireModule}
          className="form"
          style={{ margin: "100px 60px 20px" }}
        >
          <div className="div">
            <label htmlFor="">stagiaire</label> <br />
            <select required value={stagiaire_id} onChange={handleSelectChange1}>
              <option value="" selected disabled>
                -- Sélectionner un stagiaire --
              </option>

              {stagiaires.map((stagiare) => (
                <option key={stagiare.id} value={stagiare.id}>
                  {stagiare.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="div">
            <label htmlFor="">Module</label> <br />
            <select required value={module_id} onChange={handleSelectChange2}>
              <option value="" selected disabled>
                -- Sélectionner un module --
              </option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.nom}
                </option>
              ))}
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
