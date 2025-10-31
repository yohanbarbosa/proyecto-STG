import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    cedula: "",
    fechaNacimiento: "",
    telefono: "",
    sexo: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombres, apellidos, correo, contraseña, confirmarContraseña } =
      formData;

    if (!nombres || !apellidos || !correo || !contraseña || !confirmarContraseña) {
      return Swal.fire("Todos los campos son obligatorios");
    }
    if (contraseña.length < 6) {
      return Swal.fire("La contraseña debe tener al menos 6 caracteres");
    }
    if (contraseña !== confirmarContraseña) {
      return Swal.fire("Las contraseñas no coinciden");
    }

    try {
      const emaillower = correo.trim().toLowerCase();
      const userMethod = await createUserWithEmailAndPassword(auth, emaillower, contraseña);
      const user = userMethod.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombres,
        apellidos,
        correo: emaillower,
        estado: "pendiente",
        rol: "visitante",
        creado: new Date(),
        metodo: "contraseña",
      });

      Swal.fire("Registrado", "Usuario creado con éxito", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error de registro: ", error);
      if (error.code === "auth/email-already-in-use") {
        Swal.fire("Correo en uso", "Debe ingresar otro correo", "error");
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex w-[900px] h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden text-black">
        <form onSubmit={handleSubmit} className="w-1/2 flex flex-col justify-center px-12">
          {/* Logo */}
          <div className="mb-8 mt-1.5 flex flex-col items-center">
            <Icon icon="mdi:adjust" width="64" height="64" />
            <span className="font-bold text-xs text-gray-800 mt-2">
              Sistema de trámites gubernamentales
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Regístrate</h2>
          <p className="text-gray-500 mb-6">Crea tu cuenta ingresando tus datos</p>

          {/* Nombres */}
          <div className="mb-4">
            <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
              <Icon icon="mdi:account" width="24" height="24" />
              <input
                name="nombres"
                type="text"
                className="bg-transparent outline-none flex-1"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Apellidos */}
          <div className="mb-4">
            <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
              <Icon icon="mdi:account" width="24" height="24" />
              <input
                name="apellidos"
                type="text"
                className="bg-transparent outline-none flex-1"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Correo */}
          <div className="mb-4">
            <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
              <Icon icon="mdi:email" width="24" height="24" />
              <input
                name="correo"
                type="email"
                className="bg-transparent outline-none flex-1"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
              <Icon icon="mdi:lock-outline" width="24" height="24" />
              <input
                name="contraseña"
                type={showPassword ? "text" : "password"}
                className="bg-transparent outline-none flex-1"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                <Icon
                  icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  width="22"
                  height="22"
                />
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-4">
            <div className="flex items-center border rounded-lg space-x-1 px-3 py-2 bg-gray-50">
              <Icon icon="mdi:lock-check-outline" width="24" height="24" />
              <input
                name="confirmarContraseña"
                type={showConfirmPassword ? "text" : "password"}
                className="bg-transparent outline-none flex-1"
                placeholder="Confirmar contraseña"
                value={formData.confirmarContraseña}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none"
              >
                <Icon
                  icon={showConfirmPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  width="22"
                  height="22"
                />
              </button>
            </div>
          </div>

          <div className="flex items-center my-4">
            <div className=" h-px bg-gray-200"></div>
          </div>

          {/* Botón */}
          <button className="w-full bg-[#0366ff] text-white py-3 mt-2.5 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition cursor-pointer">
            Registrarse
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>

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
