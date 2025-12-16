import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Layouts/Dashboard.jsx";
import Tramites from "./pages/page-tramites/Tramites.jsx";
import TipoTramites from "./pages/page-tipo-estado-tramites/TipoEstadoTramites.jsx";
import Funcionarios from "./pages/page-funcionarios/Funcionarios.jsx";
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import ForgotPassword from "./pages/auth/forgotPassword.jsx";
import ResetPassword from "./pages/auth/resetPassword.jsx";
import Home from "./pages/Layouts/Home.jsx";
import ProtectedRoute from "./routes/protectedRoute.jsx";
import Sessions from "./pages/page-sessions/Sessions.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import UserDashboard from "./pages/Layouts/UserDashboard.jsx";
import Error404 from "./pages/errors/Error404.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="admin">
                  <Dashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Userdashboard"
            element={
              <ProtectedRoute>
                <RoleRoute requiredRole="usuario">
                  <UserDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramites"
            element={
              <ProtectedRoute>
                <Tramites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tipo-tramites"
            element={
              <ProtectedRoute>
                <TipoTramites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funcionarios"
            element={
              <ProtectedRoute>
                <Funcionarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sesiones"
            element={
              <ProtectedRoute>
                <Sessions />
              </ProtectedRoute>
            }
          />

          <Route path="/notFound" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
