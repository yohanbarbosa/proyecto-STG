import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Función de validación
  const validateForm = () => {
    const newErrors = {};
    const { nombres, apellidos, correo, contraseña, confirmarContraseña } = formData;

    // Validar nombres
    if (!nombres.trim()) {
      newErrors.nombres = "Los nombres son obligatorios";
    } else if (nombres.trim().length < 2) {
      newErrors.nombres = "Los nombres deben tener al menos 2 caracteres";
    }

    // Validar apellidos
    if (!apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    } else if (apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres";
    }

    // Validar correo
    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "El correo no es válido";
    }

    // Validar contraseña
    if (!contraseña) {
      newErrors.contraseña = "La contraseña es obligatoria";
    } else if (contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres";
    } else if (!/(?=.*[a-z])/.test(contraseña)) {
      newErrors.contraseña = "Debe incluir al menos una letra minúscula";
    } else if (!/(?=.*[A-Z])/.test(contraseña)) {
      newErrors.contraseña = "Debe incluir al menos una letra mayúscula";
    } else if (!/(?=.*\d)/.test(contraseña)) {
      newErrors.contraseña = "Debe incluir al menos un número";
    }

    // Validar confirmación de contraseña
    if (!confirmarContraseña) {
      newErrors.confirmarContraseña = "Debes confirmar la contraseña";
    } else if (contraseña !== confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error en el formulario",
        text: "Por favor corrige los errores antes de continuar",
      });
      return;
    }

    setLoading(true);

    try {
      const { nombres, apellidos, correo, contraseña } = formData;
      const emaillower = correo.trim().toLowerCase();
      
      const userMethod = await createUserWithEmailAndPassword(auth, emaillower, contraseña);
      const user = userMethod.user;

      await updateProfile(auth.currentUser, {
        displayName: `${nombres.trim()} ${apellidos.trim()}`
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        correo: emaillower,
        estado: "pendiente",
        creado: new Date(),
        metodo: "contraseña",
        role: "usuario",
      });

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error de registro: ", error);
      
      let errorMessage = "Ocurrió un error durante el registro";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este correo ya está registrado. Por favor usa otro correo o inicia sesión.";
          break;
        case "auth/invalid-email":
          errorMessage = "El correo electrónico no es válido";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es muy débil";
          break;
        case "auth/network-request-failed":
          errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
          break;
        default:
          errorMessage = "Ocurrió un error inesperado. Por favor intenta nuevamente.";
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
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
              <Icon icon="mdi:account-plus" width="48" height="48" className="text-blue-600" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-gray-800 text-center max-w-[250px]">
              Sistema de trámites gubernamentales
            </span>
          </div>

          {/* Título */}
          <div className="mb-6 sm:mb-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Crear Cuenta</h2>
            <p className="text-sm sm:text-base text-gray-600">Completa el formulario para registrarte</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombres <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:border-transparent transition ${
                errors.nombres 
                  ? "border-red-500 focus-within:ring-red-500" 
                  : "border-gray-300 focus-within:ring-blue-500"
              }`}>
                <Icon icon="mdi:account-outline" width="20" height="20" className="text-gray-400 mr-2" />
                <input
                  name="nombres"
                  type="text"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="Tus nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                />
              </div>
              {errors.nombres && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                  {errors.nombres}
                </p>
              )}
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:border-transparent transition ${
                errors.apellidos 
                  ? "border-red-500 focus-within:ring-red-500" 
                  : "border-gray-300 focus-within:ring-blue-500"
              }`}>
                <Icon icon="mdi:account-outline" width="20" height="20" className="text-gray-400 mr-2" />
                <input
                  name="apellidos"
                  type="text"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="Tus apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </div>
              {errors.apellidos && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                  {errors.apellidos}
                </p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:border-transparent transition ${
                errors.correo 
                  ? "border-red-500 focus-within:ring-red-500" 
                  : "border-gray-300 focus-within:ring-blue-500"
              }`}>
                <Icon icon="mdi:email-outline" width="20" height="20" className="text-gray-400 mr-2" />
                <input
                  name="correo"
                  type="email"
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  placeholder="tu@email.com"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>
              {errors.correo && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                  {errors.correo}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:border-transparent transition ${
                errors.contraseña 
                  ? "border-red-500 focus-within:ring-red-500" 
                  : "border-gray-300 focus-within:ring-blue-500"
              }`}>
                <Icon icon="mdi:lock-outline" width="20" height="20" className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                  name="contraseña"
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 min-w-0"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contraseña}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" />
                </button>
              </div>
              {errors.contraseña && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                  {errors.contraseña}
                </p>
              )}
              {!errors.contraseña && formData.contraseña && (
                <div className="mt-2 space-y-1">
                  <p className={`text-xs flex items-center ${
                    formData.contraseña.length >= 6 ? "text-green-600" : "text-gray-500"
                  }`}>
                    <Icon icon={formData.contraseña.length >= 6 ? "mdi:check-circle" : "mdi:circle-outline"} className="w-3 h-3 mr-1" />
                    Al menos 6 caracteres
                  </p>
                  <p className={`text-xs flex items-center ${
                    /(?=.*[a-z])/.test(formData.contraseña) ? "text-green-600" : "text-gray-500"
                  }`}>
                    <Icon icon={/(?=.*[a-z])/.test(formData.contraseña) ? "mdi:check-circle" : "mdi:circle-outline"} className="w-3 h-3 mr-1" />
                    Una letra minúscula
                  </p>
                  <p className={`text-xs flex items-center ${
                    /(?=.*[A-Z])/.test(formData.contraseña) ? "text-green-600" : "text-gray-500"
                  }`}>
                    <Icon icon={/(?=.*[A-Z])/.test(formData.contraseña) ? "mdi:check-circle" : "mdi:circle-outline"} className="w-3 h-3 mr-1" />
                    Una letra mayúscula
                  </p>
                  <p className={`text-xs flex items-center ${
                    /(?=.*\d)/.test(formData.contraseña) ? "text-green-600" : "text-gray-500"
                  }`}>
                    <Icon icon={/(?=.*\d)/.test(formData.contraseña) ? "mdi:check-circle" : "mdi:circle-outline"} className="w-3 h-3 mr-1" />
                    Un número
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:border-transparent transition ${
                errors.confirmarContraseña 
                  ? "border-red-500 focus-within:ring-red-500" 
                  : "border-gray-300 focus-within:ring-blue-500"
              }`}>
                <Icon icon="mdi:lock-check-outline" width="20" height="20" className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                  name="confirmarContraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-transparent outline-none flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 min-w-0"
                  placeholder="Repite la contraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" />
                </button>
              </div>
              {errors.confirmarContraseña && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                  {errors.confirmarContraseña}
                </p>
              )}
              {!errors.confirmarContraseña && formData.confirmarContraseña && formData.contraseña === formData.confirmarContraseña && (
                <p className="text-green-600 text-xs mt-1 flex items-center">
                  <Icon icon="mdi:check-circle" className="w-3 h-3 mr-1" />
                  Las contraseñas coinciden
                </p>
              )}
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:account-plus" className="w-5 h-5" />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </form>

          {/* Link */}
          <div className="mt-6 text-center md:text-left">
            <p className="text-xs sm:text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Inicia sesión
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
                backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/020/265/111/non_2x/world-map-connection-futuristic-modern-website-background-or-cover-page-for-technology-and-finance-concept-and-education-future-company-vector.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-white z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md">
              <Icon icon="mdi:account-check" width="64" height="64" className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-center">Únete Ahora</h3>
              <p className="text-sm text-center text-blue-100 leading-relaxed">
                Accede a todos los servicios de trámites gubernamentales de forma rápida y segura.
              </p>
            </div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Banner móvil */}
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6">
          <div className="flex items-center justify-center space-x-4 text-white">
            <Icon icon="mdi:account-check" className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Registro rápido</p>
              <p className="text-xs text-blue-100">Solo tomará un minuto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}