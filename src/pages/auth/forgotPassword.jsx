import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");

  const handlePasswordResert = async (e) => {
    e.preventDefault();

    if (!email) {
      return Swal.fire(
        "Atención",
        "Por favor ingresa tu correo electrónico",
        "warning"
      );
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire(
        "Correo enviado",
        "Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada o correo no deseado.",
        "success"
      );
    } catch (error) {
      console.log(error.code);
      Swal.fire("Error", "El formato del correo no es válido.", "error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center  bg-[#dee1e8] ">
      <div className="flex w-[900px] h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden text-neutral-800 ">
        <div className="w-1/2 flex flex-col justify-center px-12">
          {/* Logo */}
          <div className="mb-8 mt-1.5 flex flex-col items-center">
            <Icon icon="mdi:adjust" width="64" height="64" />
            <span className="font-bold text-xs text-gray-800 mt-2">
              Sistema de trámites gubernamentales
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Restablecer Contraseña</h2>
          <p className="text-gray-500 mb-6">
            Ingrese su correo asociado a la cuenta para recuperar su contraseña
          </p>

          <form onSubmit={handlePasswordResert}>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
                <Icon icon="mdi:account" width="24" height="24" />
                <input
                  value={email}
                  type="email"
                  className="bg-transparent outline-none flex-1"
                  placeholder="Correo electrónico"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center my-4">
              <div className=" h-px bg-gray-200"></div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0366ff] text-white py-3 mt-2.5 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition cursor-pointer"
            >
              Enviar
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
