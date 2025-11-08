// pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import AppLayout from "../../components/AppLayout";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // "users" o "sessions"

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar usuarios
      const usersSnapshot = await getDocs(
        query(collection(db, "users"), orderBy("lastLogin", "desc"))
      );
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      // Cargar sesiones
      const sessionsSnapshot = await getDocs(
        query(collection(db, "sessions"), orderBy("loginTime", "desc"))
      );
      const sessionsData = sessionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getProviderIcon = (provider) => {
    const icons = {
      "google.com": "logos:google-icon",
      "facebook.com": "logos:facebook",
      "github.com": "mdi:github",
      password: "mdi:email",
    };
    return icons[provider] || "mdi:account";
  };

  const getProviderName = (provider) => {
    const names = {
      "google.com": "Google",
      "facebook.com": "Facebook",
      "github.com": "GitHub",
      password: "Email/Password",
    };
    return names[provider] || provider;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon icon="mdi:loading" className="animate-spin text-4xl mb-2" />
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === "users"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon icon="mdi:account-group" className="inline mr-2" />
              Usuarios Registrados ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === "sessions"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon icon="mdi:clock-outline" className="inline mr-2" />
              Historial de Sesiones ({sessions.length})
            </button>
          </div>
        </div>

        {/* Botón de actualizar */}
        <button
          onClick={loadData}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <Icon icon="mdi:refresh" className="inline mr-2" />
          Actualizar
        </button>

        {/* Tabla de Usuarios */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Proveedores
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Último Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                              {user.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name || "Sin nombre"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {user.providers?.map((provider, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                              title={getProviderName(provider)}
                            >
                              <Icon
                                icon={getProviderIcon(provider)}
                                width="16"
                              />
                              <span className="text-xs">
                                {getProviderName(provider)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isOnline
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isOnline ? "🟢 En línea" : "⚫ Desconectado"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Sesiones */}
        {activeTab === "sessions" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hora de Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hora de Salida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {session.name || "Sin nombre"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={getProviderIcon(session.provider)}
                            width="20"
                          />
                          <span className="text-sm">
                            {getProviderName(session.provider)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(session.loginTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.logoutTime
                          ? formatDate(session.logoutTime)
                          : "Activa"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.duration
                          ? formatDuration(session.duration)
                          : "En curso..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            session.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {session.isActive ? "🟢 Activa" : "⚫ Finalizada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
