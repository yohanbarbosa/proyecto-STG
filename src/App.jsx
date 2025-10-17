import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Layouts/Dashboard.jsx';
import Tramites from "./pages/page-tramites/Tramites.jsx";
import TipoTramites from './pages/page-tipo-tramites/TipoTramites.jsx';
import Funcionarios from "./pages/page-funcionarios/Funcionarios.jsx";
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx"
import ForgotPassword from "./pages/auth/forgotPassword.jsx"
import Home from "./pages/Layouts/Home.jsx";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={< Login/>}></Route>
        <Route path="/register" element={< Register/>}></Route>
        <Route path="/forgotPassword" element={< ForgotPassword/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/tramites" element={<Tramites />}></Route>
        <Route path="/tipo-tramites" element={<TipoTramites/>}></Route>
        <Route path="/funcionarios" element={<Funcionarios/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
