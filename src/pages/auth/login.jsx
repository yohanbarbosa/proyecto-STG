import { Icon } from "@iconify/react";
import { auth,GoogleProvider, providerGitHub, providerFacebook,} from "../../firebase";
import {fetchSignInMethodsForEmail, signInWithPopup, signInWithEmailAndPassword, linkWithCredential,} from "firebase/auth";
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
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const existingEmail = error.customData.email;
        const pendingCred = error.credential;

        // Primero pedimos que inicie sesión con el método original
        const providers = await fetchSignInMethodsForEmail(auth, existingEmail);
        if (providers.includes("password")) {
          const password = prompt(
            "Tu cuenta usa contraseña. Ingresa tu contraseña para vincularla:"
          );
          const credential = EmailAuthProvider.credential(
            existingEmail,
            password
          );
          const userCred = await signInWithEmailAndPassword(
            auth,
            existingEmail,
            password
          );

          // Una vez autenticado, enlazamos GitHub
          await linkWithCredential(userCred.user, pendingCred);
          console.log("Cuenta vinculada con éxito");
        }
      } else {
        console.error("Error en el login:", error);
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, providerFacebook);
      Swal.fire("Inicio de sesión con Facebook exitoso!", "", "success");
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        Swal.fire(
          "Error de inicio de sesión",
          "Esta cuenta ya tiene un método de acceso asignado. Por favor, inicia sesión con ese método primero (por ejemplo, Google o correo electrónico). Luego podrás vincular tu cuenta con este nuevo método desde la configuración de tu perfil.",
          "warning"
        );
      }

      console.error(error);
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
    <div className="min-h-screen flex items-center justify-center bg-[#dee1e8] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden text-neutral-800">
        {/* Sección del formulario */}
        <div className="py-6  w-full md:w-1/2 flex flex-col justify-center px-6 ">
          {/* Logo */}
          <div className="mb-6 md:mb-8 mt-1.5 flex flex-col items-center">
            <Icon
              icon="mdi:adjust"
              width="48"
              height="48"
              className="md:w-16 md:h-16"
            />
            <span className="font-bold text-xs text-gray-800 mt-2 text-center">
              Sistema de trámites gubernamentales
            </span>
          </div>

          {/* Texto de bienvenida */}
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Bienvenido</h2>
          <p className="text-gray-500 mb-4 md:mb-6">
            Bienvenido, ingrese sus datos
          </p>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
                <Icon icon="mdi:account" width="24" height="24" />
                <input
                  name="email"
                  type="email"
                  className="bg-transparent outline-none flex-1 text-sm md:text-base"
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
                  className="bg-transparent outline-none flex-1 text-sm md:text-base"
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center my-4">
              <div className=" h-px bg-gray-200"></div>
            </div>

            {/* Botón continuar */}
            <button
              type="submit"
              className="w-full bg-[#0366ff] text-white py-2.5 md:py-3 mt-2.5 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition cursor-pointer text-sm md:text-base"
            >
              Continuar
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-4">
            <div className=" h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">O continúa con</span>
            <div className=" h-px bg-gray-300"></div>
          </div>

          {/* Botones de redes sociales */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className=" cursor-pointer flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Icon icon="logos:google-icon" width="20" />
              <span className="text-sm">Google</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              type="button"
              className=" cursor-pointer flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Icon icon="logos:facebook" width="20" />
              <span className="text-sm">Facebook</span>
            </button>

            <button
              onClick={loginWithGitHub}
              type="button"
              className=" cursor-pointer flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Icon icon="mdi:github" width="20" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>

          <p className="text-xs text-gray-400 pt-2">
            ¿Olvidaste tu contraseña?{" "}
            <Link
              to="/forgotPassword"
              className="text-blue-500 hover:underline"
            >
              Recupérala
            </Link>
          </p>
        </div>

        {/* Imagen lateral - Oculta en móviles */}
        <div
          className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center min-h-[400px]"
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
