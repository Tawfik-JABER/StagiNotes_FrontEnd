import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Alert from "@mui/material/Alert";

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";
import DirectorSideBar from "../../../components/DirectorSideBar";
import { CircularProgress } from "@mui/material";

export default function UpdateTut() {
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

  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const navigate = useNavigate();

  const [cin, setCin] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sexe, setSexe] = useState("");
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  //--------------------------------------------- alertMessage
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  useEffect(() => {
    fetchFormatteur();
  }, []);

  const fetchFormatteur = async () => {
    await axios
      .get(`http://localhost:8000/api/director/showTutteur/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      .then(({ data }) => {
        console.log(data);
        // const{cin,nom,prenom,email,password,sexe} = data.formatteur
        setCin(data.tutteur.cin);
        setNom(data.tutteur.nom);
        setPrenom(data.tutteur.prenom);
        setEmail(data.tutteur.email);
        setPassword(data.tutteur.password);
        setSexe(data.tutteur.sexe);
      })
      .catch(({ response: { data } }) => {
        console.log(data.message);
      });
  };

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

  const updateTutteur = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setLoading(true)

    const formData = new FormData();
    formData.append("cin", cin);
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("sexe", sexe);
    await axios
      .post(
        `http://localhost:8000/api/director/updateTutteur/${id}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        }
      )
      .then(({ data }) => {
        setAlertMessage(data.message);
        if (data.success) {
          setAlertSeverity("success");
        } else {
          setAlertSeverity("error");
        }
        setLoading(false)
        console.log(data.message);
        setTimeout(() => navigate("/director/listTutteur"), 1000);
      })
      .catch(({ response }) => {
        setLoading(false)
        if (response.success === false) {
          navigate("/director/listFormatteur");
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
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
        <h4 className="h4">Modifier Un Tutteur</h4>
        {alertMessage && (
          <Alert severity={alertSeverity} style={{ marginTop: "20px" }}>
            {alertMessage}
          </Alert>
        )}
        <form action="" onSubmit={updateTutteur} className="form">
          <div>
            <label htmlFor="">Cin</label> <br />
            <input
              type="text"
              placeholder="CIN De Formatteur"
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
              type="text"
              placeholder="Nom De Formatteur"
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
              type="text"
              placeholder="Prenom De Formatteur"
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
              type="email"
              placeholder="Email De Formatteur"
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
              type="password"
              placeholder="Password De Formatteur"
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
              type="text"
              placeholder="Sexe De Formatteur"
              value={sexe}
              onChange={(e) => {
                setSexe(e.target.value);
              }}
            />
            {errors.sexe && <span className="error">{errors.sexe}</span>}

          </div>
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Modifier"}
          </button>
        </form>
      </div>
    </>
  );
}
