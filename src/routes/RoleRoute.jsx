import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

export default function RoleRoute({ children, requiredRole }) {
  const { user } = useAuth();


  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "usuario") {
      return <Navigate to="/Userdashboard" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/notFound" replace />;
  }

  return children;
}