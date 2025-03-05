import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DirectorLogin from "./pages/Director/DirectorLogin";
import HomePage from "./pages/HomePage"; // ------------------ Home page
import Error from "../src/pages/error/errorPage"; // ------------------ Error page
// -------------------------------- pages related to Formatteur
import CreateForm from "./pages/Director/Formatteur/createForm";
import ListForm from "./pages/Director/Formatteur/listForm";
import UpdateForm from "./pages/Director/Formatteur/updateForm";
// -------------------------------- pages related to tutteur
import CreateTut from "./pages/Director/Tutteur/createTut";
import ListTut from "./pages/Director/Tutteur/listTut";
import UpdateTut from "./pages/Director/Tutteur/updateTut";
// -------------------------------- pages related to Fillier
import CreateFill from "./pages/Director/Filiere/createFill";
import ListFill from "./pages/Director/Filiere/listFill";
import UpdateFill from "./pages/Director/Filiere/updateFill";
// -------------------------------- pages related to Stagiaire and Module
import Module from "./pages/Director/Modules";
import ListStagiaireDir from "./pages/Director/ListStagiaires";
// -------------------------------- pages related to Reset Password
import ForgotPasswordDir from "./pages/Director/ForgotPasswordDir";
import TutteurLogin from "./pages/Tutteur/TutteurLogin";
import TutteurProfile from "./pages/Tutteur/TutteurProfile"
import ForgotPasswordTut from "./pages/Tutteur/ForgotPasswordTut";
import CreateStagiaire from "./pages/Tutteur/Stagiaire/CreateStagiaire";
import ListStagiaire from "./pages/Tutteur/Stagiaire/ListStagiaire";
import UpdateStagiaire from "./pages/Tutteur/Stagiaire/UpdateStagiaire";
import UpdateModule from "./pages/Tutteur/Modules/UpdateModule";
import ListModule from "./pages/Tutteur/Modules/ListModule";
import ListFormatteurFiliereModule from "./pages/Tutteur/FormatteurFiliereModule/ListFormatteurFiliereModule";
import UpdateFormatteurFiliereModule from "./pages/Tutteur/FormatteurFiliereModule/UpdateFormatteurFiliereModule";
import ListStagiaireModule from "./pages/Tutteur/StagiaireModule/ListStagiaireModule";
import UpdateStagiaireModule from "./pages/Tutteur/StagiaireModule/UpdateStagiaireModule";
import ListAbsence from "./pages/Tutteur/Absence/ListAbsence";
import UpdateAbsence from "./pages/Tutteur/Absence/UpdateAbsence";
import NoteStagiaireTutt from "./pages/Tutteur/NoteStagiaireTutt";
import StagiaireResults from "./pages/Formatteur/StagiaireResults"
import FormatteurLogin from "./pages/Formatteur/FormatteurLogin";
import FormatteurProfile from "./pages/Formatteur/FormatteurProfile";
import ForgotPasswordForm from "./pages/Formatteur/ForgotPasswordForm";
import StagiaireProfile from "./pages/Stagiaire/StagiaireProfile";
import StagiaireLogin from "./pages/Stagiaire/StagiaireLogin";
import ForgotPasswordStag from "./pages/Stagiaire/ForgotPasswordStag";
import ListNote from "./pages/Formatteur/ListNote";
import SuiveNote from "./pages/Stagiaire/SuiveNote";
import DirectorProfile from "./pages/Director/DirectorProfile";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />

                {/* ------------------------------------------------------- Routes Of Director ------------------------------------------------------- */}

                <Route path="/director">
                    <Route path="login" element={<DirectorLogin />} />
                    <Route path="profile" element={<DirectorProfile />} />
                    {/* ------------------------------- Routes Of CRUD Formatteur ------------------------------- */}
                    <Route path="createFormatteur" element={<CreateForm />} />
                    <Route path="listFormatteur" element={<ListForm />} />
                    <Route path="updateFormatteur/:id" element={<UpdateForm />} />
                    {/* ------------------------------- Routes Of CRUD Formatteur ------------------------------- */}
                    <Route path="createTutteur" element={<CreateTut />} />
                    <Route path="listTutteur" element={<ListTut />} />
                    <Route path="updateTutteur/:id" element={<UpdateTut />} />
                    {/* ------------------------------- Routes Of CRUD Filiére ------------------------------- */}
                    <Route path="createFiliere" element={<CreateFill />} />
                    <Route path="listFiliere" element={<ListFill />} />
                    <Route path="updateFiliere/:id" element={<UpdateFill />} />
                    {/* ------------------------------- Routes Of Stagiaire and Module ------------------------------- */}
                    <Route path="modules" element={<Module />} />
                    <Route path="stagiaires" element={<ListStagiaireDir />} />
                    {/* ------------------------------- Routes Of Reset Password ------------------------------- */}
                    <Route path="resetPassword" element={<ForgotPasswordDir />} />
                </Route>

                {/* ------------------------------------------------------- Routes Of Tutteur ------------------------------------------------------- */}

                <Route path="/tutteur">
                    <Route path="login" element={<TutteurLogin />} />
                    {/* ------------------------------- Routes Of Reset Password ------------------------------- */}
                    <Route path="resetPassword" element={<ForgotPasswordTut />} />
                    {/* ------------------------------- Routes Of CRUD Stagiaire ------------------------------- */}
                    <Route path="createStagiaire" element={<CreateStagiaire />} />
                    <Route path="listStagiaire" element={<ListStagiaire />} />
                    <Route path="updateStagiaire/:id" element={<UpdateStagiaire />} />
                    {/* ------------------------------- Routes Of CRUD Module ------------------------------- */}
                    <Route path="listModule" element={<ListModule />} />
                    <Route path="updateModule/:id" element={<UpdateModule />} />
                    {/* ------------------------------- Routes Of CRUD Formatteur_Filiere_Module ------------------------------- */}
                    <Route path="listFormatteurFiliereModule" element={<ListFormatteurFiliereModule />} />
                    <Route path="updateFormatteurFiliereModule/:id" element={<UpdateFormatteurFiliereModule />} />
                    {/* ------------------------------- Routes Of CRUD Stagiaire_Module ------------------------------- */}
                    <Route path="listStagiaireModule" element={<ListStagiaireModule />} />
                    <Route path="updateStagiaireModule/:id" element={<UpdateStagiaireModule />} />
                    {/* ------------------------------- Routes Of CRUD Stagiaire_Module ------------------------------- */}
                    <Route path="listStagiaireModule" element={<ListStagiaireModule />} />
                    <Route path="updateStagiaireModule/:id" element={<UpdateStagiaireModule />} />
                    {/* ------------------------------- Routes Of CRUD Absence ------------------------------- */}
                    <Route path="listAbsence" element={<ListAbsence />} />
                    <Route path="updateAbsence/:id" element={<UpdateAbsence />} />
                    {/* ------------------------------- Routes Of Affiche Notes ------------------------------- */}
                    <Route path="noteStagiaireTutt" element={<NoteStagiaireTutt />} />
                    {/* ------------------------------- Routes Of makess Notes showing------------------------------- */}
                    <Route path="profile" element={<TutteurProfile />} />
                </Route>

                {/* ------------------------------------------------------- Routes Of Formatteur ------------------------------------------------------- */}

                <Route path="/formatteur">
                    <Route path="login" element={<FormatteurLogin />} />
                    {/* ------------------------------- Routes Of Reset Password ------------------------------- */}
                    <Route path="resetPassword" element={<ForgotPasswordForm />} />
                    {/* ------------------------------- Routes Of Notes ------------------------------- */}
                    <Route path="ListNote" element={<ListNote />} />
                    {/* ------------------------------- Routes Of Notes ------------------------------- */}
                    <Route path="stagiare_results" element={<StagiaireResults />} />
                    {/* ------------------------------- Routes Of profile ------------------------------- */}
                    <Route path="profile" element={<FormatteurProfile />} />
                </Route>

                {/* ------------------------------------------------------- Routes Of stagiaire ------------------------------------------------------- */}

                <Route path="/stagiaire">
                    <Route path="login" element={<StagiaireLogin />} />
                    {/* ------------------------------- Routes Of Reset Password ------------------------------- */}
                    <Route path="resetPassword" element={<ForgotPasswordStag />} />
                    {/* ------------------------------- Routes Of Affiche Notes ------------------------------- */}
                    <Route path="suiveNote" element={<SuiveNote />} />
                    {/* ------------------------------- Routes Of Affiche Notes ------------------------------- */}
                    <Route path="profile" element={<StagiaireProfile />} />
                </Route>

                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
}

export default App;
