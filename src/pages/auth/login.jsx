import "./login-global.css";
import { Icon } from "@iconify/react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      return Swal.fire("Ingrese todos los campos");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      Swal.fire("Inicio de sesion exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("el error is:", error);
      switch (error.code) {
        case "auth/invalid-credential":
          Swal.fire("Correo o contraseña incorrectos.");
          break;
        default:
          Swal.fire("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="h-full flex items-center justify-center  bg-[#dee1e8] ">
      <div className="flex w-[900px] h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden text-neutral-800 ">
        <div className="flex w-[900px] h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden text-black">
          <div className="w-1/2 flex flex-col justify-center px-12">
            {/* Logo */}
            <div className="mb-8 mt-1.5 flex flex-col items-center">
              <Icon icon="mdi:adjust" width="64" height="64" color="" />
              <span className="font-bold text-xs text-gray-800 mt-2">
                Sistema de trámites gubernamentales
              </span>
            </div>

            {/* Texto de bienvenida */}
            <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
            <p className="text-gray-500 mb-6">Bienvenido, ingrese sus datos</p>

            {/* Inicio de sesion */}
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
              {/* Boton continuar */}
              <button className="w-full bg-[#0366ff] text-white py-3 mt-2.5 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition cursor-pointer">
                Continue
              </button>
            </form>
            {/* Footer */}
            <p className="text-xs text-gray-400 ">
              No tienes una cuenta?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Regístrate
              </Link>
            </p>

            <p className="text-xs text-gray-400 pt-2">
              Olvidaste tu contraseña?{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Recupérala
              </a>
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
    </div>
  );
}
