import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";
import DirectorSideBar from "../../../components/DirectorSideBar";

export default function CreateTut() {

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
  const navigate = useNavigate();
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  
  const [cin, setCin] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sexe, setSexe] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const formErrors = {}
    if (cin.length < 7 || cin.length > 8) {
      formErrors.cin = "CIN must be between 7 and 8 characters"
    }
    if (!nom) {
      formErrors.nom = "Name is required"
    }
    if (!prenom) {
      formErrors.prenom = "First name is required"
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid"
    }
    if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters"
    }
    if (!sexe) {
      formErrors.sexe = "Gender is required"
    }
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const createTutteur = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setLoading(true)

    const accesToken = localStorage.getItem("Token_dir");
    const formData = new FormData();
    formData.append("cin", cin);
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("sexe", sexe);
    await axios
      .post("http://localhost:8000/api/director/addTutteur", formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
      setLoading(false)
        navigate("/director/listTutteur");
      })
      .catch(({ response }) => {
        setLoading(false)
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
        <h4 className="h4">Créer Un Tutteur</h4>
        <form action="" onSubmit={createTutteur} className="form">
          <div>
            <label htmlFor="">Cin</label> <br />
            <input
              required
              type="text"
              placeholder="CIN De Tutteur"
              value={cin}
              onChange={(e) => {
                setCin(e.target.value);
              }}
            />
            {errors.cin && <span className="error">{errors.cin}</span>}

          </div>
          <div>
            <label htmlFor="">Nom</label> <br />
            <input
              required
              type="text"
              placeholder="Nom De Tutteur"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
              }}
            />
            {errors.nom && <span className="error">{errors.nom}</span>}
          </div>
          <div>
            <label htmlFor="">Prenom</label> <br />
            <input
              required
              type="text"
              placeholder="Prenom De Tutteur"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
              }}
            />
            {errors.prenom && <span className="error">{errors.prenom}</span>}
          </div>
          <div>
            <label htmlFor="">Email</label> <br />
            <input
              required
              type="email"
              placeholder="Email De Tutteur"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="">Password</label> <br />
            <input
              required
              type="password"
              placeholder="Password De Tutteur"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div>
            <label htmlFor="">Sexe</label> <br />
            <input
              required
              type="text"
              placeholder="Sexe De Tutteur"
              value={sexe}
              onChange={(e) => {
                setSexe(e.target.value);
              }}
            />
            {errors.sexe && <span className="error">{errors.sexe}</span>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Ajouter"}
          </button>
        </form>
      </div>
    </>
  );
}
