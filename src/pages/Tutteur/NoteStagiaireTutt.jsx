import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import profile from "../../images/profile_pic.png";

import "../../styles/dashboard.css";

import TutteurSideBar from "../../components/TutteurSideBar";

const NoteStagiaireTutt = () => {
  const [id, setId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const [imageProfilUrl, setImageProfilUrl] = useState(null);
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  

  const handleIdChange = (event) => {
    setId(event.target.value);
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
    fetchstagiaire();
  }, []);

  const fetchstagiaire = async () => {
    const accesToken = localStorage.getItem("Token_Tutt");
    try {
      await axios
        .get(`http://localhost:8000/api/tutteur/showStagiaireInfo`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accesToken,
          },
        })
        .then(({ data }) => {
          console.log(data);
          setStagiaires(data.stagiaires);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    if (id === '') {
      setMessage('(Vous devez sélectionner un stagiaire)')
    }else {
      setMessage('')
      setLoading(true)
      const accesToken = localStorage.getItem("Token_Tutt");
      try {
        await axios
          .get(`http://localhost:8000/api/tutteur/showStagiaireNotes?id=${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + accesToken,
            },
          })
          .then(({ data }) => {
            setLoading(false)
            console.log(data);
            setTableData(data.notes);
            setShowTable(true);
          });
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
  }
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
          Chercher des Notest
        </h4>
        <div className="form" style={{ margin: "140px 60px 20px" }}>
          <div className="div">
            <label htmlFor="">Stagiaire <span style={{fontSize:'10px',color:'red'}}>{message}</span></label> <br />
            <select required value={id} onChange={handleIdChange}>
              <option value="" disabled>
                -- Sélectionner un stagiaire --
              </option>
              {stagiaires.map((stagiaire) => (
                <option key={stagiaire.id} value={stagiaire.id}>
                  {stagiaire.nom} {stagiaire.prenom} | CEF : {stagiaire.cef}
                </option>
              ))}
            </select>
          </div>
          <button onClick={fetchData} disabled={loading}>
            {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Afficher"}
          </button>
        </div>
        <div className="overflow">
          {showTable && (
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Module</th>
                  <th scope="col">Premier Controle</th>
                  <th scope="col">Deuxieme Controle</th>
                  <th scope="col">Troisieme Controle</th>
                  <th scope="col">Efm</th>
                  <th scope="col">Note Generale</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td scope="row">{item.module}</td>
                    <td>{item.premierControle}</td>
                    <td>{item.deuxiemeControle}</td>
                    <td>{item.troisiemeControle}</td>
                    <td>{item.efm}</td>
                    <td>{item.noteGenerale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteStagiaireTutt;
