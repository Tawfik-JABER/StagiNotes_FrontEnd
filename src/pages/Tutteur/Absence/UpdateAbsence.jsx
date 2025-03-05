import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Alert } from "@mui/material";
import { CircularProgress } from "@mui/material";
import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";
import TutteurSideBar from "../../../components/TutteurSideBar";

export default function UpdateAbsence() {
  //--------------------------------------- Check the token
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
  const [imageProfilUrl, setImageProfilUrl] = useState(null);


  // pour la formulaire
  const [stagiaires, setStagiaires] = useState([]);

  const [stagiaire_id, setStagiaire_id] = useState("");
  const [durrée, setDurrée] = useState("");
  const [date, setDate] = useState("");
  const [justifié, setJustifié] = useState("");
  // set values for id
  const handleSelectChange1 = (event) => {
    setStagiaire_id(event.target.value);
  };
  const handleSelectChange2 = (event) => {
    setJustifié(event.target.value);
  };
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAbsence();
  }, []);
  //  --------------------------------------- Show
  const fetchAbsence = async () => {
    await axios
      .get(`http://localhost:8000/api/tutteur/showAbsence/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        console.log(data);
        setDate(data.absence.date);
        setJustifié(data.absence.justifié);
        setDurrée(data.absence.durrée);
        setStagiaires(data.stagiaires);
      })
      .catch(({ response: { data } }) => {
        console.log(data.message);
      });
  };
  const accesToken = localStorage.getItem("Token_Tutt");
  //  --------------------------------------- Create
  const updateAbsence = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("stagiaire_id", stagiaire_id);
    formData.append("durrée", durrée);
    formData.append("date", date);
    formData.append("justifié", justifié);
    await axios
      .post(`http://localhost:8000/api/tutteur/updateAbsence/${id}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        setLoading(false)
        setAlertMessage(data.message);
        if (data.success) {
          setAlertSeverity("success");
        } else {
          setAlertSeverity("error");
        }
        console.log(data.message);
        setTimeout(() => navigate("/tutteur/listAbsence"), 1000);
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.success === false) {
          navigate("/tutteur/listAbsence");
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
        }
      });
  };

  return (
    <>
      <TutteurSideBar />
      <div className="content">
        <div className="nav">
          <div class="input-with-icon"></div>
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
        <h4 className="h4" style={{ margin: "100px 60px -20px" }}>
          Modifier Un enseignant
        </h4>
        {alertMessage && (
          <Alert style={{ marginTop: "20px" }} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        )}
        <form
          action=""
          onSubmit={updateAbsence}
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
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Modifier"}
          </button>
        </form>
      </div>
    </>
  );
}
