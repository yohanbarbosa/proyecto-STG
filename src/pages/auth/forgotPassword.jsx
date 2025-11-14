import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async (e) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Sección del formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Icon 
                icon="mdi:lock-reset" 
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
              Restablecer Contraseña
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Ingresa tu correo para recuperar tu contraseña
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handlePasswordReset} className="space-y-4">
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
                  value={email}
                  type="email"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="tu@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <Icon icon="mdi:email-send" className="w-5 h-5" />
              <span>Enviar enlace de recuperación</span>
            </button>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2">
                <Icon 
                  icon="mdi:information-outline" 
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" 
                />
                <p className="text-xs sm:text-sm text-blue-800">
                  Recibirás un correo con instrucciones para restablecer tu contraseña. 
                  Si no lo encuentras, revisa tu carpeta de spam.
                </p>
              </div>
            </div>
          </form>

          {/* Enlaces */}
          <div className="mt-6 space-y-2 text-center md:text-left">
            <p className="text-xs sm:text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Imagen lateral - Solo visible en desktop */}
        <div
          className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden"
        >
          {/* Overlay con patrón */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/020/265/111/non_2x/world-map-connection-futuristic-modern-website-background-or-cover-page-for-technology-and-finance-concept-and-education-future-company-vector.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Contenido decorativo */}
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-white z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md">
              <Icon 
                icon="mdi:shield-lock-outline" 
                width="64" 
                height="64" 
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold mb-3 text-center">
                Seguridad Garantizada
              </h3>
              <p className="text-sm text-center text-blue-100 leading-relaxed">
                Tu información está protegida. El proceso de recuperación es 
                seguro y rápido. Recibirás un enlace temporal válido por 24 horas.
              </p>
              
              {/* Características de seguridad */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon icon="mdi:check-circle" className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Enlace de un solo uso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon icon="mdi:check-circle" className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Validación por email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon icon="mdi:check-circle" className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Encriptación SSL</span>
                </div>
              </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Banner inferior para móvil */}
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6">
          <div className="flex items-center justify-center space-x-4 text-white">
            <Icon icon="mdi:shield-check" className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Proceso seguro</p>
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