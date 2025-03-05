import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";

import TutteurSideBar from "../../../components/TutteurSideBar";
import { CircularProgress } from "@mui/material";

export default function UpdateModule() {
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
  const accesToken = localStorage.getItem("Token_Tutt");
  const { id } = useParams();

  const navigate = useNavigate();

  const [imageProfilUrl, setImageProfilUrl] = useState(null);

  const [nom, setNom] = useState("");
  const [code, setCode] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [loading, setLoading] = useState(false)

  //--------------------------------------------- alertMessage
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  useEffect(() => {
    fetchModule();
  }, []);
  const fetchModule = async () => {
    await axios
      .get(`http://localhost:8000/api/tutteur/showModule/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        setCode(data.module.code);
        setNom(data.module.nom);
        setCoefficient(data.module.coefficient);
      })
      .catch(({ response: { data } }) => {
        console.log(data.message);
      });
  };
  const updateModule = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("code", code);
    formData.append("nom", nom);
    formData.append("coefficient", coefficient);
    await axios
      .post(`http://localhost:8000/api/tutteur/updateModule/${id}`, formData, {
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
        setTimeout(() => navigate("/tutteur/listModule"), 1000);
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.success === false) {
          navigate("/tutteur/listModule");
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
          <div></div>
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
        <h4 className="h4" style={{ margin: "111px 60px -20px" }}>
          Modifier Un Module
        </h4>
        {alertMessage && (
          <Alert severity={alertSeverity} style={{ marginTop: "20px" }}>
            {alertMessage}
          </Alert>
        )}
        <form
          action=""
          onSubmit={updateModule}
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
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Modifier"}
          </button>
        </form>
      </div>
    </>
  );
}
