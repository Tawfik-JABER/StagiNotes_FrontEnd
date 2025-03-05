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
export default function ListTut() {
  //--------------------------------------- Check the token

  const navigate = useNavigate();
  const [tutteurs, setTutteurs] = useState([]);
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
    fetchTutteurs();
  }, []);

  const fetchTutteurs = async () => {
    setLoading(true);
    try {
      await axios
        .get(`http://localhost:8000/api/director/showTutteurs`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setTutteurs(data.tutteurs);
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

  const filteredTutteurs = tutteurs.filter((tutteur) => {
    const fullName = tutteur.nom + " " + tutteur.prenom;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // --------------------------- Search Input -----------
  const deleteTutteur = async (id, nomTutteur) => {
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(
      `tu peux suprimer ce Tutteur avec nom ${nomTutteur}`
    );
    if (confirmed) {
      await axios
        .delete(`http://localhost:8000/api/director/deleteTutteur/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data.message);
          fetchTutteurs();
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
        <h4 className="h4">Les Tutteurs</h4>
        <div className="overflow">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Cin</th>
                <th scope="col">Nom</th>
                <th scope="col">Prenom</th>
                <th scope="col">Email</th>
                <th scope="col">Sexe</th>
                <th scope="col" colspan="2">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {tutteurs &&
                filteredTutteurs.map((row, key) => (
                  <tr key={key}>
                    <td scope="row">{row.cin}</td>
                    <td>{row.nom}</td>
                    <td>{row.prenom}</td>
                    <td>{row.email}</td>
                    <td>{row.sexe}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteTutteur(row.id, row.nom)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link to={`/director/updateTutteur/${row.id}`}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading ? <LinearProgress /> : ""}
        </div>
        <Link className="a" to="/director/createTutteur">
          Ajouter Un Tutteur
        </Link>
      </div>
    </>
  );
}
