import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"

import profile from "../../../images/profile_pic.png";

import "../../../styles/dashboard.css";
import DirectorSideBar from "../../../components/DirectorSideBar";

export default function CreateFill() {
    const navigate = useNavigate();
    const [imageProfilUrl, setImageProfilUrl] = useState(null);
    const [loading, setLoading] = useState(false)

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

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");

    const createFilier = async (e) => {
        setLoading(true)
        const accesToken = localStorage.getItem("Token_dir");
        e.preventDefault();
        const formData = new FormData();
        formData.append("nom", nom);
        formData.append("description", description);
        await axios
            .post("http://localhost:8000/api/director/addFiliere", formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + accesToken,
                },
            })
            .then(({ data }) => {
                setLoading(false)
                navigate("/director/listFiliere");
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
                    <div class="input-with-icon">Créer Un Filiere</div>
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
                <form action="" onSubmit={createFilier} className="form">
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
                        {loading ? <CircularProgress sx={{ color: "#eee" }} size={"20px"} /> : "Ajouter"}
                    </button>
                </form>
            </div>
        </>
    );
}
