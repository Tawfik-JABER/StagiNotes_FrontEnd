import React from 'react';
import { Link } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';

import "./styles/home.css"

export default function Home() {
  const color1 = deepPurple[800];
  const color2 = deepPurple[700];
  const color3 = deepPurple[600];
  const color4 = deepPurple[500];

    return (
      // <div>
        <div class="home">
          <div class="box">
          <Link to="/director/login" className='a'>
              Directeur
            </Link>
          </div>
          <div class="box">
            <Link to="/tutteur/login" className='a'>
              Tutteur
            </Link>
          </div>
          <div class="box">
            <Link to="/formatteur/login" className='a'>
              Formatteur
            </Link>
          </div>
          <div class="box">
            <Link to="/stagiaire/login" className='a'>
              Stagiaire
            </Link>
          </div>
        </div>
      //   <AppBar position="static">
      //     <Toolbar style={{backgroundColor:"black"}}>
      //       <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
      //         <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' ,borderRadius: "50%", marginTop:"8px"}} />
      //       </Typography>
      //       <Typography variant="h6">StagiaireNote</Typography>
      //     </Toolbar>
      //   </AppBar>
      //   <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)',flexDirection: "column" }}>
      //     <Button variant="contained" color="secondary" size="large" sx={{ m: 2 ,width: "90%"}}>
      //       <Link to="/director/login">
      //         Login As Director
      //       </Link>
      //     </Button>
      //     <Button variant="contained" color="primary" size="large" sx={{ m: 2,width: "90%" }}>
      //       <Link to="/tutteur/login">
      //         Login As Tutteur
      //       </Link>
      //     </Button>
      //     <Button variant="contained" color="success" size="large" sx={{ m: 2,width: "90%" }}>
      //       <Link to="/formatteur/login">
      //         Login As Formatteur
      //       </Link>
      //     </Button>
      //     <Button variant="contained" color="warning" size="large" sx={{ m: 2,width: "90%" }}>
      //       <Link to="/stagiaire/login">
      //         Login As Stagiaire
      //       </Link>
      //     </Button>
      //   </Container>
      // </div>
    );
}

