import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";

function ForgotPasswordTut() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      const accesToken = localStorage.getItem("Token_Tutt");
      if(accesToken) {
          navigate("/tutteur/listStagiaire");
      }
    },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setResponse("Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/tutteur/resetPassword", {
        email,
      });
      setResponse("the new password send to your email");
      setTimeout(() => navigate("/tutteur/login"), 1000);
    } catch (error) {
      setResponse("Incorrect email");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
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
          <Avatar sx={{ m: 1, backgroundColor: "#5a708d" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Réinitialiser le mot de passe
          </Typography>
          {response && <Typography variant="body1">{response}</Typography>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "#153866",
                "&:hover": { backgroundColor: "#3c65a9" },
              }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "#eee" }} size={"25px"} />
              ) : (
                "Réinitialiser"
              )}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/tutteur/login" variant="body2">
                  Revenir à la connexion
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ForgotPasswordTut;
