// pages/AdminPanel.jsx
import { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase.js";
import AppLayout from "../../components/AppLayout";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  
  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  // Resetear página al cambiar de tab o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

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

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    const dataToFilter = activeTab === "users" ? users : sessions;
    
    if (!searchTerm) return dataToFilter;

    return dataToFilter.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        item.email?.toLowerCase().includes(search) ||
        item.displayName?.toLowerCase().includes(search) ||
        item.id?.toLowerCase().includes(search) ||
        (activeTab === "sessions" && item.provider?.toLowerCase().includes(search))
      );
    });
  }, [users, sessions, activeTab, searchTerm]);

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
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
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon icon="mdi:loading" className="animate-spin text-4xl mb-2 mx-auto" />
            <p>Cargando datos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-3 px-3 sm:px-4 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === "users"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon icon="mdi:account-group" className="inline mr-1 sm:mr-2" />
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`pb-3 px-3 sm:px-4 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === "sessions"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon icon="mdi:clock-outline" className="inline mr-1 sm:mr-2" />
              Sesiones ({sessions.length})
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y acciones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Icon 
              icon="mdi:magnify" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" 
            />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === "users" ? "usuarios" : "sesiones"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon icon="mdi:close-circle" className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Botón actualizar */}
          <button
            onClick={loadData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Icon icon="mdi:refresh" className="w-5 h-5" />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-600">
          Mostrando {paginatedData.length} de {filteredData.length} resultados
          {searchTerm && ` (filtrado de ${activeTab === "users" ? users.length : sessions.length} total)`}
        </div>

        {/* Tabla de Usuarios */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                      Proveedores
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                      Último Login
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 sm:mr-3 flex-shrink-0 text-sm">
                                {user.displayName?.charAt(0) || "U"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 text-sm truncate">
                                {user.displayName || "Sin nombre"}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                ID: {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                          <div className="truncate max-w-[200px]">{user.email}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="flex gap-2 flex-wrap">
                            {user.providers?.map((provider, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs"
                                title={getProviderName(provider)}
                              >
                                <Icon icon={getProviderIcon(provider)} width="14" />
                                <span className="hidden xl:inline">
                                  {getProviderName(provider)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell whitespace-nowrap">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              user.isOnline
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.isOnline ? "🟢 En línea" : "⚫ Offline"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <Icon icon="mdi:account-off" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No se encontraron usuarios</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Sesiones */}
        {activeTab === "sessions" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Método
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                      Entrada
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                      Salida
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                      Duración
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                            {session.displayName || "Sin nombre"}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {session.email}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon icon={getProviderIcon(session.provider)} width="18" className="flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">
                              {getProviderName(session.provider)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell whitespace-nowrap">
                          {formatDate(session.loginTime)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell whitespace-nowrap">
                          {session.logoutTime ? formatDate(session.logoutTime) : "Activa"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900 hidden md:table-cell whitespace-nowrap">
                          {session.duration ? formatDuration(session.duration) : "En curso..."}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              session.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {session.isActive ? "🟢 Activa" : "⚫ Finalizada"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        <Icon icon="mdi:clock-alert-outline" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No se encontraron sesiones</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Botón anterior */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Números de página */}
              <div className="flex gap-1">
                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition text-sm ${
                        currentPage === page
                          ? "bg-blue-500 text-white font-semibold"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* Botón siguiente */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="hidden sm:inline">Siguiente</span>
                <Icon icon="mdi:chevron-right" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}