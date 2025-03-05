import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import profile from "../../../images/profile_pic.png";

import TutteurSideBar from "../../../components/TutteurSideBar";

import "../../../styles/dashboard.css";
import { CircularProgress } from "@mui/material";

export default function CreateStagiaire() {
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
  const navigate = useNavigate();

  const [imageProfilUrl, setImageProfilUrl] = useState(null);

  const [cin, setCin] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fill_id, setFill_id] = useState("");
  const [numero, setNumero] = useState("");
  const [cef, setCef] = useState("");
  const [group, setGroup] = useState("");
  const [annee, setAnnee] = useState("");
  const [niveau, setNiveau] = useState("");
  const [sexe, setSexe] = useState("");
  const [filieres, setFilieres] = useState([]);
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)


  const handleSelectChange1 = (event) => {
    setFill_id(event.target.value);
  };

  const handleSelectChange2 = (event) => {
    setNiveau(event.target.value);
  };

  useEffect(() => {
    fetchStagiaires();
  }, []);
  const fetchStagiaires = async () => {
    const accesToken = localStorage.getItem("Token_Tutt");
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showStagiaires`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data);
          setFilieres(data.filieres);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const validateForm = () => {
    const errors = {}

    if (!cin || cin.length < 7 || cin.length > 8) {
      errors.cin = "CIN is required and must be between 7 and 8 characters"
    }

    if (!nom) {
      errors.nom = "Name is required"
    }

    if (!prenom) {
      errors.prenom = "First name is required"
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Valid email is required"
    }

    if (!password || password.length < 6) {
      errors.password = "Password is required and must be at least 6 characters"
    }

    if (!fill_id) {
      errors.fill_id = "Filiere is required"
    }

    if (!numero) {
      errors.numero = "Numéro is required"
    }

    if (!cef) {
      errors.cef = "CEF is required"
    }

    if (!group) {
      errors.group = "Group is required"
    }

    if (!annee) {
      errors.annee = "Année is required"
    }

    if (!niveau) {
      errors.niveau = "Niveau is required"
    }

    if (!sexe) {
      errors.sexe = "Sexe is required"
    }

    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const createStagiaire = async (e) => {
    const accesToken = localStorage.getItem("Token_Tutt");
    e.preventDefault()
    
    if (!validateForm()) {
      return // Stop the form submission if validation fails
    }
    setLoading(true)
    
    const formData = new FormData();
    formData.append("cin", cin);
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fill_id", fill_id);
    formData.append("numero", numero);
    formData.append("cef", cef);
    formData.append("group", group);
    formData.append("annee", annee);
    formData.append("niveau", niveau);
    formData.append("sexe", sexe);
    await axios
      .post("http://localhost:8000/api/tutteur/addStagiaire", formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        setLoading(false)
        navigate("/tutteur/listStagiaire");
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.status === 422) {
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
        <h4 className="h4" style={{ margin: "-50px 60px -20px" }}>
          Créer Un Stagiaire
        </h4>
        <form action="" onSubmit={createStagiaire} className="form">
          <div className="div">
            <label htmlFor="">Cin</label> <br />
            <input
              required
              type="text"
              placeholder="CIN De Stagiaire"
              value={cin}
              onChange={(e) => {
                setCin(e.target.value);
              }}
            />
            {errors.cin && <span className="error">{errors.cin}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Nom</label> <br />
            <input
              required
              type="text"
              placeholder="Nom De Stagiaire"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
              }}
            />
            {errors.nom && <span className="error">{errors.nom}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Prenom</label> <br />
            <input
              required
              type="text"
              placeholder="Prenom De Stagiaire"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
              }}
            />
            {errors.prenom && <span className="error">{errors.prenom}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Email</label> <br />
            <input
              required
              type="email"
              placeholder="Email De Stagiaire"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Password</label> <br />
            <input
              required
              type="password"
              placeholder="Password De Stagiaire"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Filiere</label> <br />
            <select value={fill_id} onChange={handleSelectChange1}>
              <option value="" disabled selected>
                -- Sélectionner un fillier --
              </option>
              {filieres.map((filliere) => (
                <option key={filliere.id} value={filliere.id}>
                  {filliere.nom}
                </option>
              ))}
            </select>
            {errors.fill_id && <span className="error">{errors.fill_id}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Numéro</label> <br />
            <input
              required
              type="text"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
              }}
            />
            {errors.numero && <span className="error">{errors.numero}</span>}
          </div>
          <div className="div">
            <label htmlFor="">CEF</label> <br />
            <input
              required
              type="text"
              value={cef}
              onChange={(e) => {
                setCef(e.target.value);
              }}
            />
            {errors.cef && <span className="error">{errors.cef}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Group</label> <br />
            <input
              required
              type="text"
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
              }}
            />
            {errors.group && <span className="error">{errors.group}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Année</label> <br />
            <input
              required
              type="text"
              placeholder="1 ou 2"
              value={annee}
              onChange={(e) => {
                setAnnee(e.target.value);
              }}
            />
            {errors.annee && <span className="error">{errors.annee}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Niveau</label> <br />
            <select value={niveau} onChange={handleSelectChange2}>
              <option value="" disabled selected>
                -- Sélectionner un Niveau --
              </option>
              <option value="Technicien Spécialisé">
                Technicien Spécialisé
              </option>
              <option value="Technicien">Technicien</option>
              <option value="Qualification">Qualification</option>
              <option value="Spécialisation">Spécialisation</option>
            </select>
            {errors.niveau && <span className="error">{errors.niveau}</span>}
          </div>
          <div className="div">
            <label htmlFor="">Sexe</label> <br />
            <input
              required
              type="text"
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
  )
}
