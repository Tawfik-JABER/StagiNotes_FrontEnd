import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import profile from "../../images/profile_pic.png";
import "../../styles/dashboard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import DirectorSideBar from "../../components/DirectorSideBar";
import { LinearProgress } from "@mui/material";

export default function ListStagiaireDir() {
  //--------------------------------------- Check the token

  const navigate = useNavigate();
  const [stagiaires, setStagiaires] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const accesToken = localStorage.getItem("Token_dir");

  useEffect(() => {
    const affiche = async () => {
      const accesToken = localStorage.getItem("Token_dir");
      if (
        accesToken === "undefined" ||
        accesToken === null ||
        accesToken === 0 ||
        accesToken === false
      ) {
        navigate("/director/login");
      }
      try {
        await axios({
          method: "get",
          url: "http://localhost:8000/api/director/",
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
    fetchStagiaire();
  }, []);

  const fetchStagiaire = async () => {
    setLoading(true);
    try {
      await axios
        .get(`http://localhost:8000/api/director/showStagiaires`, {
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
  // --------------------------- Search Input -----------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStagiaires = stagiaires.filter((stagiaire) => {
    const fullName = stagiaire.nom + " " + stagiaire.prenom;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // --------------------------- Search Input -----------

  return (
    <>
      <DirectorSideBar />
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
            <Link to="/director/profile">
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
                <th scope="col">Cin</th>
                <th scope="col">CEF</th>
                <th scope="col">Nom</th>
                <th scope="col">Prenom</th>
                <th scope="col">Email</th>
                <th scope="col">Filiere</th>
                <th scope="col">Group</th>
                <th scope="col">Année</th>
                <th scope="col">Niveau</th>
                <th scope="col">Sexe</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires &&
                filteredStagiaires.map((row, key) => (
                  <tr key={key}>
                    <td>{row.cin}</td>
                    <td>{row.cef}</td>
                    <td>{row.nom}</td>
                    <td>{row.prenom}</td>
                    <td>{row.email}</td>
                    <td>{row.nomFill}</td>
                    <td>{row.group}</td>
                    <td>{row.annee}</td>
                    <td>{row.niveau}</td>
                    <td>{row.sexe}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading ? <LinearProgress /> : ""}
        </div>
      </div>
    </>
  );
}
