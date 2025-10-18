import { Icon } from "@iconify/react";
import { auth, GoogleProvider } from "../../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // --- Inicio de sesión con correo y contraseña ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      return Swal.fire("Ingrese todos los campos");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("El error es:", error);
      switch (error.code) {
        case "auth/invalid-credential":
          Swal.fire("Correo o contraseña incorrectos.");
          break;
        default:
          Swal.fire("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    }
  };

  // --- Inicio de sesión con Google (optimizado) ---
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      if (result.user) {
        Swal.fire("Inicio de sesión con Google exitoso!", "", "success");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
  
      // Detectar si el usuario cerró manualmente el popup
      if (error.code === "auth/popup-closed-by-user") {
        Swal.fire({
          icon: "info",
          title: "Inicio de sesión cancelado",
          text: "Has cerrado la ventana de Google antes de completar el inicio de sesión.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión con Google",
          text: "Ocurrió un error inesperado. Intenta nuevamente.",
        });
      }
    }
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- JSX principal ---
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

          {/* Texto de bienvenida */}
          <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
          <p className="text-gray-500 mb-6">Bienvenido, ingrese sus datos</p>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
                <Icon icon="mdi:account" width="24" height="24" />
                <input
                  name="email"
                  type="email"
                  className="bg-transparent outline-none flex-1"
                  placeholder="Usuario o correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
                <Icon icon="mdi:password" width="24" height="24" />
                <input
                  name="password"
                  type="password"
                  className="bg-transparent outline-none flex-1"
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            {/* Login con Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 transition w-full"
            >
              <Icon icon="logos:google-icon" width="24" />
              <span>Continuar con Google</span>
            </button>

            {/* Botón continuar */}
            <button
              type="submit"
              className="w-full bg-[#0366ff] text-white py-3 mt-2.5 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition cursor-pointer"
            >
              Continuar
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>

          <p className="text-xs text-gray-400 pt-2">
            ¿Olvidaste tu contraseña?{" "}
            <Link to="/forgotPassword" className="text-blue-500 hover:underline">
              Recupérala
            </Link>
          </p>
        </div>

        {/* Imagen lateral */}
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
