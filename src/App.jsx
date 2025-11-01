import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Layouts/Dashboard.jsx';
import Tramites from "./pages/page-tramites/Tramites.jsx";
import TipoTramites from './pages/page-tipo-tramites/TipoTramites.jsx';
import Funcionarios from "./pages/page-funcionarios/Funcionarios.jsx";
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx"
import ForgotPassword from "./pages/auth/forgotPassword.jsx"
import ResetPassword from "./pages/auth/resetPassword.jsx";
import Home from "./pages/Layouts/Home.jsx";
import ProtectedRoute from "./routes/protectedRoute.jsx";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={< Login/>}></Route>
        <Route path="/register" element={< Register/>}></Route>
        <Route path="/forgotPassword" element={< ForgotPassword/>}></Route>
        <Route path="/resetPassword" element={< ResetPassword/>}></Route>
        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path="/tramites" element={<ProtectedRoute><Tramites /></ProtectedRoute>}></Route>
        <Route path="/tipo-tramites" element={<ProtectedRoute><TipoTramites/></ProtectedRoute>}></Route>
        <Route path="/funcionarios" element={<ProtectedRoute><Funcionarios/></ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
