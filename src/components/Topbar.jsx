import { useState } from "react";
import { Icon } from "@iconify/react";
import { auth, GoogleProvider, providerFacebook, providerGitHub, db } from "../firebase.js";
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {   linkWithPopup , signOut } from "firebase/auth";
import Swal from "sweetalert2";

function Topbar({ user }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("currentSessionId");
      
      if (sessionId) {
        // Obtener datos de la sesión
        const sessionRef = doc(db, "sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
          const sessionData = sessionSnap.data();
          const loginTime = sessionData.loginTime?.toDate();
          const logoutTime = new Date();
          
          // Calcular duración en segundos
          const duration = loginTime 
            ? Math.floor((logoutTime - loginTime) / 1000)
            : 0;
  
          // Actualizar sesión con hora de salida y duración
          await updateDoc(sessionRef, {
            logoutTime: serverTimestamp(),
            duration: duration,
            isActive: false,
          });
        }
      }
  
      // Actualizar estado del usuario
      if (auth.currentUser) {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          isOnline: false,
          lastLogout: serverTimestamp(),
        },
      {merge: true});
      }
  
      // Limpiar localStorage
      localStorage.removeItem("currentSessionId");
  
      // Cerrar sesión
      await signOut(auth);
      navigate("/login");
      
      Swal.fire({
        title: "Sesión cerrada",
        text: "Has cerrado sesión exitosamente",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire("Error", "No se pudo cerrar la sesión correctamente", "error");
    }
  };

  const handleLinkAccount = async (providerType) => {
    try {
      let provider;
      switch (providerType) {
        case "google":
          provider = GoogleProvider;
          break;
        case "facebook":
          provider = providerFacebook;
          break;
        case "github":
          provider = providerGitHub;
          break;
        default:
          return;
      }
  
      // vincular directamente
      const result = await linkWithPopup(auth.currentUser, provider);
  
      console.log("Proveedores vinculados:", result.user.providerData);
      Swal.fire("Cuenta vinculada correctamente!", "", "success");
    } catch (error) {
      if (error.code === "auth/provider-already-linked") {
        Swal.fire("Error", "Tu cuenta ya está vinculada con este proveedor.", "error");
      } else if (error.code === "auth/account-exists-with-different-credential") {
        Swal.fire("Ya existe una cuenta con ese correo", "Inicia sesión con ese proveedor y luego vincula el actual.", "info");
      } else {
        Swal.fire("Error al vincular cuenta", error.message, "error");
      }
    }
  };
  

  return (
    <header className="bg-white shadow-sm border-b w-full">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center space-x-4">
            <Icon icon="mdi:office-building" className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Trámites</h1>
              <p className="text-sm text-gray-600">Gobierno Municipal</p>
            </div>
          </div>

          {/* USUARIO */}
          <div className="relative">
            <div
              className="select-none flex items-center space-x-2 text-gray-600 cursor-pointer p-2"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <Icon icon="mdi:account" className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>

            {/* MENU DESPLEGABLE */}
            {showMenu && (
              <div
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
                className=" top-7 absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-100 z-50"
              >
                <div className="p-2">
                  <button
                    onClick={() => handleLinkAccount("google")}
                    className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700"
                  >
                    <Icon icon="logos:google-icon" className="w-5 h-5 mr-2" />
                    Vincular con Google
                  </button>

                  <button
                    onClick={() => handleLinkAccount("facebook")}
                    className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700"
                  >
                    <Icon icon="logos:facebook" className="w-5 h-5 mr-2" />
                    Vincular con Facebook
                  </button>

                  <button
                    onClick={() => handleLinkAccount("github")}
                    className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700"
                  >
                    <Icon icon="mdi:github" className="w-5 h-5 mr-2" />
                    Vincular con GitHub
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 hover:bg-red-100 text-red-600 rounded-md text-sm"
                  >
                    <Icon icon="mdi:logout" className="w-5 h-5 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;