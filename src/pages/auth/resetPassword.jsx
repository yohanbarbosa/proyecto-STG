import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!password || !confirmPassword) {
      return Swal.fire("Atención", "Por favor completa todos los campos.", "warning");
    }

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden.", "error");
    }

    if(!passwordRegex.test(password)){
      return Swal.fire("Error" , "La contraseña no cumple con los requisitos");
    };

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
              Nueva Contraseña
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Ingresa tu nueva contraseña para completar el restablecimiento
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                <Icon 
                  icon="mdi:lock-outline" 
                  width="20" 
                  height="20" 
                  className="text-gray-400 mr-2"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                <Icon 
                  icon="mdi:lock-check-outline" 
                  width="20" 
                  height="20" 
                  className="text-gray-400 mr-2"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <Icon 
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} 
                    width="20" 
                    height="20"
                  />
                </button>
              </div>
            </div>

            {/* Requisitos de contraseña */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2">
                <Icon 
                  icon="mdi:information-outline" 
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" 
                />
                <div className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <p className="font-semibold">Requisitos de la contraseña:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Mínimo 6 caracteres</li>
                    <li>Las contraseñas deben coincidir</li>
                    <li> Debe tener minimo una letra mayúscula</li>
                    <li>Contener almenos un numero</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Icon icon="mdi:check-circle" className="w-5 h-5" />
              <span>Restablecer Contraseña</span>
            </button>
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
          </div>
        </div>

        {/* Imagen lateral - Solo visible en desktop */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
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
                icon="mdi:shield-check" 
                width="64" 
                height="64" 
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold mb-3 text-center">
                Última Paso
              </h3>
              <p className="text-sm text-center text-blue-100 leading-relaxed mb-6">
                Estás a punto de completar el proceso. Crea una contraseña 
                segura para proteger tu cuenta.
              </p>
              
              {/* Consejos de seguridad */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                    <Icon icon="mdi:shield-lock" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Contraseña segura</p>
                    <p className="text-xs text-blue-100">Usa letras, números y símbolos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                    <Icon icon="mdi:key-variant" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Única y memorable</p>
                    <p className="text-xs text-blue-100">No la reutilices en otros sitios</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                    <Icon icon="mdi:account-lock" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mantén tu cuenta segura</p>
                    <p className="text-xs text-blue-100">No compartas tu contraseña</p>
                  </div>
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
              <p className="text-sm font-semibold">Paso final</p>
              <p className="text-xs text-blue-100">
                Crea una contraseña segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}