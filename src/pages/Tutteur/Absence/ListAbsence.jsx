import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress, LinearProgress } from "@mui/material";

import profile from "../../../images/profile_pic.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../../styles/dashboard.css";
import TutteurSideBar from "../../../components/TutteurSideBar";
export default function ListAbsence() {
  const navigate = useNavigate();
  // pour le tableau
  const [absences, setAbsences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // pour la formulaire
  const [stagiaires, setStagiaires] = useState([]);
  const [imageProfilUrl, setImageProfilUrl] = useState(null);

  const [stagiaire_id, setStagiaire_id] = useState("");
  const [durrée, setDurrée] = useState("");
  const [date, setDate] = useState("");
  const [justifié, setJustifié] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)

  // set values for id
  const handleSelectChange1 = (event) => {
    setStagiaire_id(event.target.value);
  };
  const handleSelectChange2 = (event) => {
    setJustifié(event.target.value);
  };

  const accesToken = localStorage.getItem("Token_Tutt");
  //  --------------------------------------- Create
  const createAbsence = async (e) => {
    setLoadingForm(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("stagiaire_id", stagiaire_id);
    formData.append("durrée", durrée);
    formData.append("date", date);
    formData.append("justifié", justifié);
    await axios
      .post("http://localhost:8000/api/tutteur/addAbsence", formData, {
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
    fetchAbsences();
  }, []);

  //  --------------------------------------- Show
  const fetchAbsences = async () => {
    setLoadingFetch(true)
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showAbsences`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          setLoadingFetch(false)
          console.log(data);
          setAbsences(data.absences);
          setStagiaires(data.stagiaires);
        });
    } catch (error) {
      setLoadingFetch(false)
      console.log(error);
    }
  };

  //  -------------------------------- Delete Module
  const deleteAbsence = async (id) => {
    console.log(id);
    /* eslint-disable no-restricted-globals */
    const confirmed = confirm(`tu peux suprimer ce Absence avec ID ${id}`);
    if (confirmed) {
      await axios
        .delete(`http://localhost:8000/api/tutteur/deleteAbsence/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data.message);
          fetchAbsences();
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

  const filteredAbsence = absences.filter((absence) => {
    // const allName = Absence.nomModule + Absence.nomFiliere + Absence.nomFormatteur  ;
    // return allName.toLowerCase().includes(searchTerm.toLowerCase());
    const { nom, prenom, date, justifié } = absence;
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return (
      nom.toLowerCase().includes(lowercaseSearchTerm) ||
      prenom.toLowerCase().includes(lowercaseSearchTerm) ||
      date.toLowerCase().includes(lowercaseSearchTerm) ||
      justifié.toLowerCase().includes(lowercaseSearchTerm)
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
          Créer Un enseignant
        </h4>
        <form
          action=""
          onSubmit={createAbsence}
          className="form"
          style={{ margin: "100px 60px 20px" }}
        >
          <div className="div">
            <label htmlFor="">Stagiaire</label> <br />
            <select required value={stagiaire_id} onChange={handleSelectChange1}>
              <option value="" disabled>
                -- Sélectionner un stagiaire --
              </option>
              {stagiaires.map((stagiaire) => (
                <option key={stagiaire.id} value={stagiaire.id}>
                  {stagiaire.nom} {stagiaire.prenom}
                </option>
              ))}
            </select>
          </div>
          <div className="div">
            <label htmlFor="">Durrée</label> <br />
            <input
              required
              type="text"
              value={durrée}
              onChange={(e) => {
                setDurrée(e.target.value);
              }}
            />
          </div>
          <div className="div">
            <label htmlFor="">Date</label> <br />
            <input
              required
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
          <div className="div">
            <label htmlFor="">Justification</label> <br />
            <select required value={justifié} onChange={handleSelectChange2}>
              <option value="" disabled>
                Select an option
              </option>
              <option value="L' absence justifiée">L' absence justifiée</option>
              <option value="L' absence injustifiée">
                L' absence injustifiée
              </option>
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
                <th scope="col">Date</th>
                <th scope="col">Durrée</th>
                <th scope="col">Justifié</th>
                <th scope="col" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              {absences &&
                filteredAbsence.map((row, key) => (
                  <tr key={key}>
                    <td>{row.id}</td>
                    <td>
                      {row.nom} {row.prenom}
                    </td>
                    <td>{row.date}</td>
                    <td>{row.durrée}</td>
                    <td>{row.justifié}</td>
                    <td style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={() => deleteAbsence(row.id)}
                        icon={faTrash}
                      />
                    </td>
                    <td>
                      <Link to={`/tutteur/updateAbsence/${row.id}`}>
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
