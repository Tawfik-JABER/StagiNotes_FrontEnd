import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "../../styles/login.css";

import logoOfppt from "../../images/Logo_ofppt.png";

export default function TutteurLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState("")
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate('')

    const loginSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password,
        }
        const auth = await axios({
            method: "post",
            data: {
                email: data.email,
                password: data.password,
            },
            url: "http://localhost:8000/api/tutteur/login",
            headers: {
                "Accept": "application/json",
            }
        }).then((res) => {
            localStorage.setItem("Token_Tutt", res.data.token)
            navigate('/tutteur/listStagiaire');
        }).catch(() => {
            setMessage("La connexion a échoué le nom d'utilisateur ou le mot de passe est incorrect")
            setTimeout(() => {
                setMessage('');
            }, 2000);
        })
    }
    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    return (
        <>
        <div className="body">
        <ThemeProvider theme={createTheme()}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ m: 1, bgcolor: "secondary.main", width: 80, height: 80 }}
              >
                {/* <LockOutlinedIcon /> */}
                <img src={logoOfppt} alt="Lock Icon" width="100%" />
              </Avatar>
              <Typography component="h4" sx={{ marginBottom: "20px" }} variant="h">
                Bienvenue dans votre espace privé
              </Typography>
              <Box
                component="form"
                onSubmit={loginSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                {message && (
                  <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{
                      mb: 2,
                      margin: 0,
                      borderRadius: "8px",
                      position: "absolute",
                      top: "30%",
                      left: "37.5%",
                      zIndex: "1",
                      background: "#f93c3c",
                      padding: "5px",
                      color: "white",
                    }}
                  >
                    {message}
                  </Typography>
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse E-mail"
                  type="email"
                  name="email"
                  autoComplete="email"
                  aria-required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#30918F", // Change the border color for focused state
                      },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de Pass"
                  type={showPassword ? "text" : "password"}
                  aria-required
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#30918F", // Change the border color for focused state
                      },
                    }}
                    />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      onChange={handlePasswordVisibility}
                      sx={{ transform: "scale(0.85)" }}
                    />
                }
                label={
                    <Typography
                    variant="body2"
                    sx={{
                        fontSize: "0.7rem",
                        marginLeft: "-5%",
                      }}
                    >
                      Afficher le mot de passe
                    </Typography>
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  // Change the hover background color
                  sx={{
                    mt: 3,
                    mb: 2,
                    background: "#153866",
                    "&:hover": { backgroundColor: "#3c65a9" },
                  }}
                >
                  Se connecter
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/tutteur/resetPassword" variant="body2">
                      Mot de passe oublié?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
        </div>
    </>
    )
}