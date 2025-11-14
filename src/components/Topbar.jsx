import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  auth,
  GoogleProvider,
  providerFacebook,
  providerGitHub,
  db,
} from "../firebase.js";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { linkWithPopup, signOut } from "firebase/auth";
import Swal from "sweetalert2";

function Topbar({ user, onMenuClick }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);


  const isProviderLinked = (providerId) => {
    return auth.currentUser?.providerData.some(
      (p) => p.providerId === providerId
    );
  };

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("currentSessionId");

      if (sessionId) {
        const sessionRef = doc(db, "sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
          const sessionData = sessionSnap.data();
          const loginTime = sessionData.loginTime?.toDate();
          const logoutTime = new Date();

          const duration = loginTime
            ? Math.floor((logoutTime - loginTime) / 1000)
            : 0;

          await updateDoc(sessionRef, {
            logoutTime: serverTimestamp(),
            duration: duration,
            isActive: false,
          });
        }
      }

      if (auth.currentUser) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            isOnline: false,
            lastLogout: serverTimestamp(),
          },
          { merge: true }
        );
      }

      localStorage.removeItem("currentSessionId");
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

      const result = await linkWithPopup(auth.currentUser, provider);
      Swal.fire("Cuenta vinculada correctamente!", "", "success");
      setShowMobileMenu(false);
    } catch (error) {
      console.error(error);

      if (error.code === "auth/provider-already-linked") {
        Swal.fire(
          "Error",
          "Tu cuenta ya está vinculada con este proveedor.",
          "error"
        );
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        Swal.fire(
          "Ya existe una cuenta con ese correo",
          "Inicia sesión con ese proveedor y luego vincula el actual.",
          "info"
        );
      } else if (error.code === "auth/credential-already-in-use") {
        Swal.fire(
          "Este proveedor ya está vinculado a otra cuenta",
          "Intenta iniciar sesión con ese proveedor.",
          "error"
        );
      } else {
        Swal.fire("Error al vincular cuenta", error.message, "error");
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b w-full sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* LOGO Y MENÚ */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <Icon icon="mdi:menu" className="w-6 h-6 text-gray-700" />
            </button>

            <Icon
              icon="mdi:office-building"
              className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
            />
            <div>
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">
                Sistema de Trámites
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Gobierno Municipal
              </p>
            </div>
          </div>

          {/* MENÚ USUARIO DESKTOP */}
          <div className="hidden md:block relative">
            <div
              className="select-none flex items-center space-x-2 text-gray-600 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <Icon icon="mdi:account" className="w-5 h-5" />
              <span className="text-sm truncate max-w-[150px]">
                {user?.displayName}
              </span>
              <Icon icon="mdi:chevron-down" className="w-4 h-4" />
            </div>

            {showMenu && (
              <div
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
                className="absolute right-0 mt-0 w-56 bg-white shadow-lg rounded-lg border border-gray-100 z-50"
              >
                <div className="p-2">
                  {/* GOOGLE */}
                  {!isProviderLinked("google.com") && (
                    <button
                      onClick={() => handleLinkAccount("google")}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors"
                    >
                      <Icon
                        icon="logos:google-icon"
                        className="w-5 h-5 mr-2"
                      />
                      Vincular con Google
                    </button>
                  )}

                  {/* FACEBOOK */}
                  {!isProviderLinked("facebook.com") && (
                    <button
                      onClick={() => handleLinkAccount("facebook")}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors"
                    >
                      <Icon icon="logos:facebook" className="w-5 h-5 mr-2" />
                      Vincular con Facebook
                    </button>
                  )}

                  {/* GITHUB */}
                  {!isProviderLinked("github.com") && (
                    <button
                      onClick={() => handleLinkAccount("github")}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors"
                    >
                      <Icon icon="mdi:github" className="w-5 h-5 mr-2" />
                      Vincular con GitHub
                    </button>
                  )}

                  <hr className="my-2" />

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 hover:bg-red-100 text-red-600 rounded-md text-sm transition-colors"
                  >
                    <Icon icon="mdi:logout" className="w-5 h-5 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MENÚ MOBILE */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Menú de usuario"
            >
              <Icon icon="mdi:dots-vertical" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* MENÚ MOBILE */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-2 border-t pt-4">
            <div className="space-y-2">
              {/* nombre */}
              <div className="flex items-center space-x-2 px-2 py-2 bg-gray-50 rounded-md">
                <Icon icon="mdi:account" className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700 truncate">
                  {user?.displayName}
                </span>
              </div>

              {/* GOOGLE */}
              {!isProviderLinked("google.com") && (
                <button
                  onClick={() => {
                    handleLinkAccount("google");
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors"
                >
                  <Icon icon="logos:google-icon" className="w-5 h-5 mr-3" />
                  Vincular con Google
                </button>
              )}

              {/* FACEBOOK */}
              {!isProviderLinked("facebook.com") && (
                <button
                  onClick={() => {
                    handleLinkAccount("facebook");
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors"
                >
                  <Icon icon="logos:facebook" className="w-5 h-5 mr-3" />
                  Vincular con Facebook
                </button>
              )}

              {/* GITHUB */}
              {!isProviderLinked("github.com") && (
                <button
                  onClick={() => {
                    handleLinkAccount("github");
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors"
                >
                  <Icon icon="mdi:github" className="w-5 h-5 mr-3" />
                  Vincular con GitHub
                </button>
              )}

              <hr className="my-2" />

              {/* LOGOUT */}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-3 py-2 hover:bg-red-100 text-red-600 rounded-md text-sm transition-colors"
              >
                <Icon icon="mdi:logout" className="w-5 h-5 mr-3" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
