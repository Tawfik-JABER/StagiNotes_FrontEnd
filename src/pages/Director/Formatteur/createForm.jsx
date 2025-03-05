"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress"

import profile from "../../../images/profile_pic.png"
import "../../../styles/dashboard.css"
import DirectorSideBar from "../../../components/DirectorSideBar"

export default function CreateForm() {
  const navigate = useNavigate()
  const [imageProfilUrl, setImageProfilUrl] = useState(null)

  const [cin, setCin] = useState("")
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sexe, setSexe] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const affiche = async () => {
      const accesToken = localStorage.getItem("Token_dir")
      if (!accesToken) {
        navigate("/director/login")
        return
      }
      try {
        const res = await axios.get("http://localhost:8000/api/director/", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        setImageProfilUrl(res.data.data.image_url)
      } catch (error) {
        console.error(error)
      }
    }
    affiche()
  }, [navigate])

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

  const createFormatteur = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setLoading(true)

    const accesToken = localStorage.getItem("Token_dir")
    const formData = new FormData()
    formData.append("cin", cin)
    formData.append("nom", nom)
    formData.append("prenom", prenom)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("sexe", sexe)
    try {
      await axios.post("http://localhost:8000/api/director/addFormatteur", formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + accesToken,
        },
      })
      setLoading(false)
      navigate("/director/listFormatteur")
    } catch (error) {
      setLoading(false)
      if (error.response && error.response.status === 422) {
        alert(error.response.data.errors.cin)
      } else {
        console.log(error.response?.data?.message || "An error occurred")
      }
    }
  }

  return (
    <>
      <DirectorSideBar />
      <div className="content">
        <div className="nav">
          <div className="input-with-icon"></div>
          <div>
            <Link to="/director/profile">
              {imageProfilUrl ? (
                <img src={`http://127.0.0.1:8000/${imageProfilUrl}`} alt="Profile" />
              ) : (
                <img src={profile || "/placeholder.svg"} alt="Profile" />
              )}
            </Link>
          </div>
        </div>
        <h4 className="h4">Créer Un Formatteur</h4>
        <form onSubmit={createFormatteur} className="form">
          <div>
            <label htmlFor="cin">Cin</label> <br />
            <input
              required
              type="text"
              id="cin"
              placeholder="DN129002"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
            />
            {errors.cin && <span className="error">{errors.cin}</span>}
          </div>
          <div>
            <label htmlFor="nom">Nom</label> <br />
            <input
              required
              type="text"
              id="nom"
              placeholder="Nom De Formatteur"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            {errors.nom && <span className="error">{errors.nom}</span>}
          </div>
          <div>
            <label htmlFor="prenom">Prenom</label> <br />
            <input
              required
              type="text"
              id="prenom"
              placeholder="Prenom De Formatteur"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            {errors.prenom && <span className="error">{errors.prenom}</span>}
          </div>
          <div>
            <label htmlFor="email">Email</label> <br />
            <input
              required
              type="email"
              id="email"
              placeholder="exmple@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password">Password</label> <br />
            <input
              required
              type="password"
              id="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div>
            <label htmlFor="sexe">Sexe</label> <br />
            <input
              required
              type="text"
              id="sexe"
              placeholder="femme or homme"
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
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

