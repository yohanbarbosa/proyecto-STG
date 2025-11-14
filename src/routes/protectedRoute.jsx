import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>; // puedes poner un spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
