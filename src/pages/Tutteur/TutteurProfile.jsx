import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

import profile from "../../images/profile_pic.png";

import "../../styles/dashboard.css";

import TutteurSideBar from "../../components/TutteurSideBar";
import PhotoProfileUpload from "../../components/PhotoProfileUpload";

export default function TutteurProfile() {
  const [cin, setCIN] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [emailVerif, setEmailVerif] = useState("");
  const [emailVerify, setEmailVerify] = useState("");
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [open, setOpen] = useState(false);

  // ------------------------------------------- fetching data for showing ----------
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
          setCIN(res.data.data.cin);
          setNom(res.data.data.nom);
          setPrenom(res.data.data.prenom);
          setEmail(res.data.data.email);
          setSexe(res.data.data.sexe);
          setEmailVerif(res.data.data.email_verify);
          setImageProfilUrl(res.data.data.image_url)
        });
      } catch (error) {
        console.error(error);
      }
    };
    affiche();
  }, []);

  // ------------------------------------------- Update Email Verify  ----------
  const updateEmailVerify = () => {
    const accesToken = localStorage.getItem("Token_Tutt");
    axios
      .post(
        "http://localhost:8000/api/tutteur/emailVerify",
        {
          email_verify: emailVerify,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accesToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // ------------------------------------------- Update Password  ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const accesToken = localStorage.getItem("Token_Tutt");
    axios
      .post(
        `http://localhost:8000/api/tutteur/changePassword`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accesToken}`,
          },
        }
      )
      .then((response) => {
        setSuccess(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/tutteur"), 1000);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data); // Output the response data to the console
          setError(error.response.data.error);
        } else {
          setError("Something went wrong. Please try again.");
        }
      });
  };
  return (
    <>
      <TutteurSideBar />
      <div className="content">
        <div className="nav">
          <div>
            Salut, {nom} {prenom}
          </div>
          <div onClick={() => setShowButton(!showButton)}>
            {imageProfilUrl ? (
              <img
                src={`http://127.0.0.1:8000/${imageProfilUrl}`}
                alt="Profile"
              />
            ) : (
              <img src={profile} alt="Profile" />
            )}
          </div>
          {showButton && (
            <button onClick={() => setOpen(true)}>
              <span>Changer la photo de profil</span>
              <CameraAltOutlinedIcon
                sx={{ width: "20px", marginLeft: "5px" }}
              />
            </button>
          )}
          <PhotoProfileUpload open={open} onClose={() => setOpen(false)} />
        </div>
        <div className="infos">
          <div className="info">
            <h4>information personelle</h4>
            <div className="data1">
              <div className="ligne">
                <div className="column">
                  <p className="p1">CIN</p>
                  <p className="p2">{cin}</p>
                </div>
                <div className="column">
                  <p className="p1">Email Adresse</p>
                  <p className="p2">{email}</p>
                </div>
              </div>
              <div className="ligne">
                <div className="column">
                  <p className="p1">Prenom</p>
                  <p className="p2">{prenom}</p>
                </div>
                <div className="column">
                  <p className="p1">Nom</p>
                  <p className="p2">{nom}</p>
                </div>
              </div>
              <div className="ligne">
                <div className="column">
                  <p className="p1">Sexe</p>
                  <p className="p2">{sexe}</p>
                </div>
                <div className="column">
                  <p className="p1">Email Recuperée</p>
                  <p className="p2">
                    {emailVerif || "défini d'e-mail de réinitialisation "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="info">
            <h4>récupération du mot de passe</h4>
            <div className="data2">
              <form action="">
                <label htmlFor="">Email</label> <br />
                <input
                  type="text"
                  value={emailVerify}
                  placeholder="e-mail de réinitialisation"
                  onChange={(e) => setEmailVerify(e.target.value)}
                />
              </form>
              <button onClick={updateEmailVerify}>Sauvegarder</button>
            </div>
          </div>
          <div className="info">
            <h4>modification du mot de passe</h4>
            <div className="data3">
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <form action="">
                <label htmlFor="">Mot De Passe</label> <br />
                <input
                  type="password"
                  id="current_password"
                  value={currentPassword}
                  placeholder="Actuel mot de passe"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  id="new_password"
                  value={newPassword}
                  placeholder="Nouveau mot de passe"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  id="confirm_password"
                  value={confirmPassword}
                  placeholder="Confirmer le Nouveau"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </form>
              <button onClick={handleSubmit}>Modifier</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
