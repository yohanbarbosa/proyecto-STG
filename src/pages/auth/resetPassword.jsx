import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode"); // token del correo
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return Swal.fire("Atención", "Por favor completa todos los campos.", "warning");
    }

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden.", "error");
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      Swal.fire("Éxito", "Tu contraseña se ha restablecido correctamente.", "success");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", "El enlace es inválido o ha expirado.", "error");
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#dee1e8]">
      <div className="flex w-[900px] h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden text-neutral-800">
        <div className="w-1/2 flex flex-col justify-center px-12">
          {/* Logo */}
          <div className="mb-8 mt-1.5 flex flex-col items-center">
            <Icon icon="mdi:adjust" width="64" height="64" />
            <span className="font-bold text-xs text-gray-800 mt-2">
              Sistema de trámites gubernamentales
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Nueva Contraseña</h2>
          <p className="text-gray-500 mb-6">
            Ingresa tu nueva contraseña para completar el restablecimiento.
          </p>

          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
                <Icon icon="mdi:lock" width="24" height="24" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none flex-1"
                  placeholder="Nueva contraseña"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
                <Icon icon="mdi:lock-check" width="24" height="24" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent outline-none flex-1"
                  placeholder="Confirmar nueva contraseña"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0366ff] text-white py-3 mt-2.5 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition cursor-pointer"
            >
              Restablecer Contraseña
            </button>
          </form>

          <p className="text-xs text-gray-400">
            Volver al{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Imagen */}
        <div
          className="w-1/2 bg-blue-100 flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/020/265/111/non_2x/world-map-connection-futuristic-modern-website-background-or-cover-page-for-technology-and-finance-concept-and-education-future-company-vector.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
}
