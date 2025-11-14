import { Icon } from "@iconify/react";
import {
  auth,
  GoogleProvider,
  providerGitHub,
  providerFacebook,
  db,
} from "../../firebase";
import {
  fetchSignInMethodsForEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  linkWithCredential,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const registerLogin = async (user, provider) => {
    try {
      const sessionId = `${user.uid}_${Date.now()}`;

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName: user.displayName || "Sin nombre",
          photoURL: user.photoURL || null,
          lastLogin: serverTimestamp(),
          isOnline: true,
          providers: user.providerData.map((p) => p.providerId),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(doc(db, "sessions", sessionId), {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || "Sin nombre",
        provider: provider,
        loginTime: serverTimestamp(),
        logoutTime: null,
        duration: null,
        isActive: true,
        userAgent: navigator.userAgent,
      });

      localStorage.setItem("currentSessionId", sessionId);
      console.log("✅ Sesión registrada correctamente");
    } catch (error) {
      console.error("❌ Error al registrar sesión:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      return Swal.fire("Ingrese todos los campos");
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await registerLogin(result.user, "password");
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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      if (result.user) {
        Swal.fire("Inicio de sesión con Google exitoso!", "", "success");
        await registerLogin(result.user, "google.com");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
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
      await registerLogin(result.user, "github.com");
      console.log("Usuario autenticado:", result.user);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const existingEmail = error.customData.email;
        const pendingCred = error.credential;
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
      const result = await signInWithPopup(auth, providerFacebook);
      Swal.fire("Inicio de sesión con Facebook exitoso!", "", "success");
      await registerLogin(result.user, "facebook.com");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 p-4">
    
        <Link className=" px-4 py-2 rounded-tl-lg rounded-br-lg left-5 top-[20px] absolute z-50 bg-blue-500 hover:border-[1px] border-black" to="/">Volver</Link>
     
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Sección del formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Icon
                icon="mdi:office-building"
                width="48"
                height="48"
                className="text-blue-600"
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-gray-800 text-center max-w-[250px]">
              Sistema de trámites gubernamentales
            </span>
          </div>

          {/* Título */}
          <div className="mb-6 sm:mb-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
              Bienvenido
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                <Icon
                  icon="mdi:email-outline"
                  width="20"
                  height="20"
                  className="text-gray-400 mr-2"
                />
                <input
                  name="email"
                  type="email"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                <Icon
                  icon="mdi:lock-outline"
                  width="20"
                  height="20"
                  className="text-gray-400 mr-2"
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="20"
                    height="20"
                  />
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Icon icon="mdi:login" className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-xs sm:text-sm">
              O continúa con
            </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Botones sociales */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              <Icon icon="logos:google-icon" width="20" />
              <span className="text-sm hidden sm:inline">Google</span>
            </button>
            <button
              onClick={handleFacebookLogin}
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              <Icon icon="logos:facebook" width="20" />
              <span className="text-sm hidden sm:inline">Facebook</span>
            </button>
            <button
              onClick={loginWithGitHub}
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              <Icon icon="mdi:github" width="20" />
              <span className="text-sm hidden sm:inline">GitHub</span>
            </button>
          </div>

          {/* Links */}
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs sm:text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Regístrate
              </Link>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              ¿Olvidaste tu contraseña?{" "}
              <Link
                to="/forgotPassword"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Recupérala
              </Link>
            </p>
          </div>
        </div>

        {/* Panel lateral - Desktop */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "url('https://static.vecteezy.com/system/resources/previews/020/265/111/non_2x/world-map-connection-futuristic-modern-website-background-or-cover-page-for-technology-and-finance-concept-and-education-future-company-vector.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-white z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md">
              <Icon
                icon="mdi:shield-account"
                width="64"
                height="64"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold mb-3 text-center">
                Acceso Seguro
              </h3>
              <p className="text-sm text-center text-blue-100 leading-relaxed">
                Tu información está protegida con los más altos estándares de
                seguridad.
              </p>
            </div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Banner móvil */}
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6">
          <div className="flex items-center justify-center space-x-4 text-white">
            <Icon icon="mdi:shield-check" className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Acceso seguro</p>
              <p className="text-xs text-blue-100">
                Tu información está protegida
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
