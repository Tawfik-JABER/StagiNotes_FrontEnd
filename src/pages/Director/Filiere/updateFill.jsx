import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";

import DirectorSideBar from "../../../components/DirectorSideBar";

export default function UpdateFill() {
  
  // ------------------------------------------- fetching data for showing ----------
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
                  setImageProfilUrl(res.data.data.image_url)
              });
          } catch (error) {
              console.error(error);
          }
      };
      affiche();
  }, []);

  const accesToken = localStorage.getItem("Token_dir");
  const { id } = useParams();

  const navigate = useNavigate();
  const [imageProfilUrl, setImageProfilUrl] = useState(null);


  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  //--------------------------------------------- alertMessage
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchFiliere();
  }, []);

  const fetchFiliere = async () => {
    await axios
      .get(`http://localhost:8000/api/director/showFiliere/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        console.log(data);
        // const{cin,nom,prenom,email,password,sexe} = data.formatteur
        setNom(data.filiere.nom);
        setDescription(data.filiere.description);
      })
      .catch(({ response: { data } }) => {
        console.log(data.message);
      });
  };
  const updateFiliere = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    await axios
      .post(
        `http://localhost:8000/api/director/updateFiliere/${id}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        }
      )
      .then(({ data }) => {
        setLoading(false)
        setAlertMessage(data.message);
        if (data.success) {
          setAlertSeverity("success");
        } else {
          setAlertSeverity("error");
        }
        console.log(data.message);
        setTimeout(() => navigate("/director/listFiliere"), 1000);
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.success === false) {
          navigate("/director/listFiliere");
        }
      });
  };

  return (
    <>
      <DirectorSideBar />
      <div className="content">
        <div className="nav">
          <div class="input-with-icon"></div>
          <div>
            <Link to="/director/profile">
              {
              imageProfilUrl ?
              (<img src={`http://127.0.0.1:8000/${imageProfilUrl}`} alt="Profile" />)
              :
              (<img src={profile} alt="Profile" />)
              }
            </Link>
          </div>
        </div>
        <h4 className="h4">Modifier Un Filiere</h4>
        {alertMessage && (
          <Alert severity={alertSeverity} style={{ marginTop: "20px" }}>
            {alertMessage}
          </Alert>
        )}
        <form action="" onSubmit={updateFiliere} className="form">
          <div>
            <label htmlFor="">Nom</label> <br />
            <input
              required
              type="text"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="">Description</label> <br />
            <input
              required
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Modifier"}
          </button>
        </form>
      </div>
    </>
  );
}
