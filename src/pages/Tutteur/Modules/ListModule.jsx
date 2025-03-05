import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress, LinearProgress } from "@mui/material";

import "../../../styles/dashboard.css";

import TutteurSideBar from "../../../components/TutteurSideBar";

export default function ListModule() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nom, setNom] = useState("");
  const [code, setCode] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const accesToken = localStorage.getItem("Token_Tutt");

  //  -------------------------------- Create Module
  const createModule = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const formData = new FormData();
    formData.append("code", code);
    formData.append("nom", nom);
    formData.append("coefficient", coefficient);
    await axios
      .post("http://localhost:8000/api/tutteur/addModule", formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        setLoadingForm(false);
        console.log(data.message);
        window.location.reload();
      })
      .catch(({ response }) => {
        setLoadingForm(false);
        if (response.status === 422) {
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
        }
      });
  };
  const [imageProfilUrl, setImageProfilUrl] = useState(null);

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
    fetchModules();
  }, []);
  //  -------------------------------- Show Modules
  const fetchModules = async () => {
    setLoadingFetch(true);
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showModules`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setLoadingFetch(false);
          console.log(data);
          setModules(data.modules);
        });
    } catch (error) {
      setLoadingForm(false);
      console.log(error);
    }
  };

  //  -------------------------------- Delete Module
  const deleteModule = async (id, nomModule) => {
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(
      `tu peux suprimer ce Module avec nom ${nomModule}`
    );
    if (confirmed) {
      await axios
        .delete(`http://localhost:8000/api/tutteur/deleteModule/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data.message);
          fetchModules();
        })
        .catch(({ response: { data } }) => {
          console.log(data.message);
          if (data.status == 422) {
            console.log(data.errors);
          }
        });
    }
  };
  // --------------------------- Search Input -----------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredModules = modules.filter((module) => {
    const ModuleName = module.nom;
    return ModuleName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <TutteurSideBar />
      <div className="content">
        <div className="nav">
          <div class="input-with-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="i" />
            <input
              required
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
          Créer Un Module
        </h4>
        <form
          action=""
          onSubmit={createModule}
          className="form"
          style={{ margin: "100px 60px 20px" }}
        >
          <div className="div">
            <label htmlFor="">Code</label> <br />
            <input
              required
              type="text"
              placeholder="Code de module"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </div>
          <div className="div">
            <label htmlFor="">Nom</label> <br />
            <input
              required
              type="text"
              value={nom}
              placeholder="Nom de module"
              onChange={(e) => {
                setNom(e.target.value);
              }}
            />
          </div>
          <div className="div">
            <label htmlFor="">Coefficient</label> <br />
            <input
              required
              type="number"
              value={coefficient}
              placeholder="Coefficient de module"
              onChange={(e) => {
                setCoefficient(e.target.value);
              }}
            />
          </div>
          <button type="submit" disabled={loadingForm}>
            {loadingForm ? (
              <CircularProgress sx={{ color: "#eee" }} size={"20px"} />
            ) : (
              "Ajouter"
            )}
          </button>
        </form>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nom Module</th>
                <th scope="col">Code Module</th>
                <th scope="col">Coefficient</th>
                <th scope="col" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              {modules &&
                filteredModules.map((row, key) => (
                  <tr key={key}>
                    <td scope="row">{row.id}</td>
                    <td>{row.nom}</td>
                    <td>{row.code}</td>
                    <td>{row.coefficient}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteModule(row.id, row.nom)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link to={`/tutteur/updateModule/${row.id}`}>
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
