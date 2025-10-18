import { Icon } from "@iconify/react";
import { auth, GoogleProvider , providerGitHub } from "../../firebase";
import { signInWithPopup, signInWithEmailAndPassword ,linkWithCredential } from "firebase/auth";
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

  const loginWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, providerGitHub);
      console.log("Usuario autenticado:", result.user);
      navigate ("/dashboard");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const existingEmail = error.customData.email;
        const pendingCred = error.credential;
  
        // Primero pedimos que inicie sesión con el método original
        const providers = await fetchSignInMethodsForEmail(auth, existingEmail);
        if (providers.includes("password")) {
          const password = prompt("Tu cuenta usa contraseña. Ingresa tu contraseña para vincularla:");
          const credential = EmailAuthProvider.credential(existingEmail, password);
          const userCred = await signInWithEmailAndPassword(auth, existingEmail, password);
  
          // Una vez autenticado, enlazamos GitHub
          await linkWithCredential(userCred.user, pendingCred);
          console.log("Cuenta vinculada con éxito");
        }
      } else {
        console.error("Error en el login:", error);
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
              className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 transition w-full cursor-pointer select-none"
            >
              <Icon icon="logos:google-icon" width="24" />
              <span>Continuar con Google</span>
            </button>

            <a
              onClick={loginWithGitHub}
              className="select-none cursor-pointer flex items-center justify-center gap-3 bg-[#24292e] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-[#2d3339] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 
    7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01
    .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
    0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
    -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12
    0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 4.47c.68 0 1.36.09 2 .26
    1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82
    1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54
    1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013
    8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Iniciar sesión con GitHub
            </a>

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
