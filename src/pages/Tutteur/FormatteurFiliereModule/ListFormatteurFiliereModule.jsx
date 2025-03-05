import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress, LinearProgress } from "@mui/material";

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";
import TutteurSideBar from "../../../components/TutteurSideBar";
export default function ListFormatteurFiliereModule() {
  const navigate = useNavigate();
  // pour le tableau
  const [formatteurFiliereModules, setFormatteurFiliereModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // pour la formulaire
  const [modules, setModules] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [formatteurs, setFormatteurs] = useState([]);

  const [formateur_id, setFormateur_id] = useState("");
  const [filliere_id, setFilliere_id] = useState("");
  const [module_id, setModule_id] = useState("");
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
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

  const accesToken = localStorage.getItem("Token_Tutt");
  //  --------------------------------------- Create
  const createFormatteurFiliereModule = async (e) => {
    setLoadingForm(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("formateur_id", formateur_id);
    formData.append("filliere_id", filliere_id);
    formData.append("module_id", module_id);
    await axios
      .post(
        "http://localhost:8000/api/tutteur/addFormatteurFiliereModule",
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        }
      )
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
  //  --------------------------------------- Fetch Data
  const fetchFormatteurFiliereModules = async () => {
    setLoadingFetch(true)
    const accesToken = localStorage.getItem("Token_Tutt");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/tutteur/showFormatteurFiliereModules`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        }
      );

      setLoadingFetch(false)
      setFormatteurFiliereModules(response.data.FormatteurFiliereModules);
      setModules(response.data.modules);
      setFormatteurs(response.data.formatteurs);
      setFilieres(response.data.filieres);
    } catch (error) {
      setLoadingFetch(false)
      console.log(error);
    }
  };

  useEffect(() => {
    const accesToken = localStorage.getItem("Token_Tutt");
    if (
      !accesToken ||
      accesToken === "undefined" ||
      accesToken === "null" ||
      accesToken === "0" ||
      accesToken === "false"
    ) {
      navigate("/tutteur/login");
    } else {
      fetchFormatteurFiliereModules(accesToken);
    }
  }, []);

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
    fetchFormatteurFiliereModules();
  }, []);

  //  -------------------------------- Delete Module
  const deleteFormatteurFiliereModule = async (id) => {
    console.log(id);
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(`tu peux suprimer ce Module avec id ${id}`);
    if (confirmed) {
      await axios
        .delete(
          `http://localhost:8000/api/tutteur/deleteFormatteurFiliereModule/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + accesToken,
            },
          }
        )
        .then(({ data }) => {
          console.log(data.message);
          fetchFormatteurFiliereModules();
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

  const filteredFormatteurFiliereModule = formatteurFiliereModules.filter(
    (formatteurFiliereModule) => {
      // const allName = formatteurFiliereModule.nomModule + formatteurFiliereModule.nomFiliere + formatteurFiliereModule.nomFormatteur  ;
      // return allName.toLowerCase().includes(searchTerm.toLowerCase());
      const { nomModule, nomFiliere, nomFormatteur } = formatteurFiliereModule;
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      return (
        nomModule.toLowerCase().includes(lowercaseSearchTerm) ||
        nomFiliere.toLowerCase().includes(lowercaseSearchTerm) ||
        nomFormatteur.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
  );

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
          onSubmit={createFormatteurFiliereModule}
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
          <button type="submit" disabled={loadingForm}>
            {loadingForm ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Ajouter"}
          </button>
        </form>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Formatteur</th>
                <th scope="col">Filiere</th>
                <th scope="col">Module</th>
                <th scope="col" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              {formatteurFiliereModules &&
                filteredFormatteurFiliereModule.map((row, key) => (
                  <tr key={key}>
                    <td>{row.id}</td>
                    <td>{row.nomFormatteur}</td>
                    <td>{row.nomFiliere}</td>
                    <td>{row.nomModule}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteFormatteurFiliereModule(row.id)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/tutteur/updateFormatteurFiliereModule/${row.id}`}
                      >
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
