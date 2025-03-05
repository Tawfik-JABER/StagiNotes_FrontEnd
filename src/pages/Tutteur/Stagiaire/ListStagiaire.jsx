import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LinearProgress from "@mui/material/LinearProgress";

import "../../../styles/dashboard.css";

import TutteurSideBar from "../../../components/TutteurSideBar";
import { Flag } from "@mui/icons-material";

export default function ListStagiaire() {
  //--------------------------------------- Check the token

  const navigate = useNavigate();
  const [stagiaires, setStagiaires] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const accesToken = localStorage.getItem("Token_Tutt");

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
    fetchStagiaires();
  }, []);

  const fetchStagiaires = async () => {
    setLoading(true);
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showStagiaires`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setLoading(false);
          setStagiaires(data.stagiaires);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteStagiaire = async (id, nomStagiaire) => {
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(
      `tu peux suprimer ce stagiaire avec nom ${nomStagiaire}`
    );
    if (confirmed) {
      await axios
        .delete(`http://localhost:8000/api/tutteur/deleteStagiaire/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data.message);
          fetchStagiaires();
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

  const filteredStagiaires = stagiaires.filter((stagiaire) => {
    const fullName = stagiaire.nom + " " + stagiaire.prenom;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
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
        <h4 className="h4">Les Stagiaires</h4>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">CIN</th>
                <th scope="col">CEF</th>
                <th scope="col">Numero</th>
                <th scope="col">Nom</th>
                <th scope="col">Prenom</th>
                <th scope="col">Email</th>
                <th scope="col">Filiere</th>
                <th scope="col">Group</th>
                <th scope="col">Année</th>
                <th scope="col">Niveau</th>
                <th scope="col">Sexe</th>
                <th scope="col" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              {stagiaires &&
                filteredStagiaires.map((row, key) => (
                  <tr key={key}>
                    <td scope="row">{row.cin}</td>
                    <td>{row.cef}</td>
                    <td>{row.numero}</td>
                    <td>{row.nom}</td>
                    <td>{row.prenom}</td>
                    <td>{row.email}</td>
                    <td>{row.nomFill}</td>
                    <td>{row.group}</td>
                    <td>{row.annee}</td>
                    <td>{row.niveau}</td>
                    <td>{row.sexe}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteStagiaire(row.id, row.nom)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link to={`/tutteur/updateStagiaire/${row.id}`}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading ? <LinearProgress /> : ""}
        </div>
        <Link className="a" to="/tutteur/createStagiaire">
          Ajouter Un Stagiaire
        </Link>
      </div>
    </>
  );
}
