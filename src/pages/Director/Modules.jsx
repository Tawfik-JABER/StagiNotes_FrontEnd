import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import profile from "../../images/profile_pic.png";
import "../../styles/dashboard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LinearProgress from "@mui/material/LinearProgress";

import "../../styles/dashboard.css";

import DirectorSideBar from "../../components/DirectorSideBar";

export default function Module() {
  //--------------------------------------- Check the token

  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
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
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      await axios
        .get(`http://localhost:8000/api/director/showModules`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setModules(data.modules);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };
  // --------------------------- Search Input -----------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredModules = modules.filter((module) => {
    const NomModule = module.nom;
    return NomModule.toLowerCase().includes(searchTerm.toLowerCase());
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
        <h4 className="h4">Les Modules</h4>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID Module</th>
                <th scope="col">Nom Module</th>
                <th scope="col">Code Module</th>
                <th scope="col">Coefficient</th>
              </tr>
            </thead>
            <tbody>
              {modules &&
                filteredModules.map((row, key) => (
                  <tr key={key}>
                    <td>{row.id}</td>
                    <td>{row.nom}</td>
                    <td>{row.code}</td>
                    <td>{row.coefficient}</td>
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
