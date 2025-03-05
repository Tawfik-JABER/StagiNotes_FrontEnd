import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LinearProgress from "@mui/material/LinearProgress";

import "../../../styles/dashboard.css";

import DirectorSideBar from "../../../components/DirectorSideBar";

export default function ListForm() {
  //--------------------------------------- Check the token

  const navigate = useNavigate();
  const [formatteurs, setFormatteurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const accesToken = localStorage.getItem("Token_dir");
  useEffect(() => {
    const affiche = async () => {
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
    fetchFormatteurs();
  }, []);

  const fetchFormatteurs = async () => {
    setLoading(true);
    try {
      await axios
        .get(`http://localhost:8000/api/director/showFormatteurs`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setFormatteurs(data.formatteurs);
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

  const filteredFormatteurs = formatteurs.filter((formatteur) => {
    const fullName = formatteur.nom + " " + formatteur.prenom;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // --------------------------- Search Input -----------

  const deleteFormatteur = async (id, nom) => {
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(
      `tu peux suprimer ce Formatteur avec le nom ${nom}`
    );
    if (confirmed) {
      await axios
        .delete(`http://localhost:8000/api/director/deleteFormatteur/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data.message);
          fetchFormatteurs();
        })
        .catch(({ response: { data } }) => {
          console.log(data.message);
          if (data.status == 422) {
            console.log(data.errors);
          }
        });
    }
  };

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
        <h4 className="h4">Les Formatteurs</h4>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Cin</th>
                <th scope="col">Nom</th>
                <th scope="col">Prenom</th>
                <th scope="col">email</th>
                <th scope="col">Sexe</th>
                <th scope="col" colspan="2">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {formatteurs &&
                filteredFormatteurs.map((row, key) => (
                  <tr key={key}>
                    <td scope="row">{row.cin}</td>
                    <td>{row.nom}</td>
                    <td>{row.prenom}</td>
                    <td>{row.email}</td>
                    <td>{row.sexe}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteFormatteur(row.id, row.nom)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link to={`/director/updateFormatteur/${row.id}`}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading ? <LinearProgress /> : ""}
        </div>
        <Link className="a" to="/director/createFormatteur">
          Ajouter Un Formatteur
        </Link>
      </div>
    </>
  );
}
