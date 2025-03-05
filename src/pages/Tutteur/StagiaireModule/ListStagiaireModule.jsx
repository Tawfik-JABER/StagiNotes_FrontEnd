import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress, LinearProgress } from "@mui/material";

import "../../../styles/dashboard.css";

import TutteurSideBar from "../../../components/TutteurSideBar";

export default function ListStagiaireModule() {
  const navigate = useNavigate();
  const [imageProfilUrl, setImageProfilUrl] = useState(null);

  // pour le tableau
  const [stagiaireModules, setStagiaireModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // pour la formulaire
  const [modules, setModules] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);

  const [loadingFetch, setLoadingFetch] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  
  const [stagiaire_id, setStagiaire_id] = useState("");
  const [module_id, setModule_id] = useState("");
  // set values for id
  const handleSelectChange1 = (event) => {
    setStagiaire_id(event.target.value);
  };

  const handleSelectChange2 = (event) => {
    setModule_id(event.target.value);
  };

  const accesToken = localStorage.getItem("Token_Tutt");
  //  --------------------------------------- Create
  const createStagiaireModule = async (e) => {
    setLoadingForm(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("stagiaire_id", stagiaire_id);
    formData.append("module_id", module_id);
    await axios
      .post("http://localhost:8000/api/tutteur/addStagiaireModule", formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        setLoadingForm(false)
        console.log(data.message);
        window.location.reload();
      })
      .catch(({ response }) => {
        setLoadingForm(false)
        if (response.status === 422) {
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
        }
      });
  };
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
    fetchStagiaireModules();
  }, []);
  //  --------------------------------------- Show
  const fetchStagiaireModules = async () => {
    setLoadingFetch(true)
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showStagiaireModules`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setLoadingFetch(false)
          console.log(data);
          setStagiaireModules(data.stagiaireModules);
          setModules(data.modules);
          setStagiaires(data.stagiaires);
        });
    } catch (error) {
      setLoadingFetch(false)
      console.log(error);
    }
  };

  //  -------------------------------- Delete Module
  const deleteStagiaireModule = async (id) => {
    console.log(id);
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(`tu peux suprimer ce Module avec id ${id}`);
    if (confirmed) {
      await axios
        .delete(
          `http://localhost:8000/api/tutteur/deleteStagiaireModule/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + accesToken,
            },
          }
        )
        .then(({ data }) => {
          console.log(data.message);
          fetchStagiaireModules();
        })
        .catch(({ response: { data } }) => {
          console.log(data.message);
        });
    }
  };
  // --------------------------- Search Input -----------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStagiaireModule = stagiaireModules.filter((stagiaireModule) => {
    const { nomModule, nomStagiaire } = stagiaireModule;
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return (
      nomModule.toLowerCase().includes(lowercaseSearchTerm) ||
      nomModule.toLowerCase().includes(lowercaseSearchTerm)
    );
  });

  return (
    <>
      <TutteurSideBar />
      <div className="content">
        <div className="nav">
          <div class="input-with-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="i" />
            <input
              type="text"
              placeholder="Rechercher ..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div>
            <Link to="/tutteur/profile">
              {imageProfilUrl ? (
                <img
                  src={`http://127.0.0.1:8000/${imageProfilUrl}`}
                  alt="Profile"
                />
              ) : (
                <img src={profile} alt="Profile" />
              )}
            </Link>
          </div>
        </div>
        <h4 className="h4" style={{ margin: "-50px 60px -20px" }}>
          Créer Un enseignant
        </h4>
        <form
          action=""
          onSubmit={createStagiaireModule}
          className="form"
          style={{ margin: "100px 60px 20px" }}
        >
          <div className="div">
            <label htmlFor="">Stagiaire</label> <br />
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
          <button type="submit" disabled={loadingForm}>
            {loadingForm ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Ajouter"}
          </button>
        </form>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Stagiaire</th>
                <th scope="col">Module</th>
                <th scope="col" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              {stagiaireModules &&
                filteredStagiaireModule.map((row, key) => (
                  <tr key={key}>
                    <td>{row.id}</td>
                    <td>{row.nomStagiaire}</td>
                    <td>{row.nomModule}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteStagiaireModule(row.id)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link to={`/tutteur/updateStagiaireModule/${row.id}`}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loadingFetch ? <LinearProgress /> : ""}
          
        </div>
      </div>
    </>
  );
}
