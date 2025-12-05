import { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase.js";
import AppLayout from "../../components/AppLayout";
import ExportExcel from "../../components/ExportExcel.jsx";
import ExportPdf from "../../components/ExportPdf.jsx";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(
        query(collection(db, "users"), orderBy("lastLogin", "desc"))
      );
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
            <Icon icon="mdi:loading" className="animate-spin text-4xl mb-2 mx-auto text-blue-600" />
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-3 px-3 sm:px-4 font-semibold transition whitespace-nowrap text-sm sm:text-base ${activeTab === "users"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Icon icon="mdi:account-group" className="inline mr-1 sm:mr-2" />
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`pb-3 px-3 sm:px-4 font-semibold transition whitespace-nowrap text-sm sm:text-base ${activeTab === "sessions"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Icon icon="mdi:clock-outline" className="inline mr-1 sm:mr-2" />
              Sesiones ({sessions.length})
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
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


          <div className="flex space-x-3 ">
            {activeTab === "users" && (
              <ExportExcel 
                data={filteredData} 
                fileName={searchTerm ? `usuarios_filtrados` : "usuarios"} 
              />
            )}
            {activeTab === "sessions" && (
              <ExportExcel 
                data={filteredData} 
                fileName={searchTerm ? `sesiones_filtradas` : "sesiones"} 
              />
            )}

            {activeTab === "users" && (
              <ExportPdf 
                data={filteredData} 
                fileName={searchTerm ? `usuarios_filtrados` : "usuarios"} 
              />
            )}
            {activeTab === "sessions" && (
              <ExportPdf 
                data={filteredData} 
                fileName={searchTerm ? `sesiones_filtradas` : "sesiones"} 
              />
            )}

            <button
              onClick={loadData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm cursor-pointer"
            >
              <Icon icon="mdi:refresh" className="w-5 h-5" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>

        </div>

        {/* Contador */}
        <div className="text-xs sm:text-sm text-gray-600">
          Mostrando {paginatedData.length} de {filteredData.length} resultados
          {searchTerm && ` (filtrado de ${activeTab === "users" ? users.length : sessions.length} total)`}
        </div>

        {/* TABLA DE USUARIOS - Desktop */}
        {activeTab === "users" && (
          <>
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Usuario
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Proveedores
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">
                        Último Login
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4">
                            <div className="flex items-center">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.displayName}
                                  className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
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
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                            <div className="truncate max-w-[200px]">{user.email}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
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
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden xl:table-cell whitespace-nowrap">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${user.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}>
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

            {/* CARDS DE USUARIOS - Mobile */}
            <div className="md:hidden space-y-4">
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <div key={user.id} className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-12 h-12 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user.displayName?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {user.displayName || "Sin nombre"}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${user.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                        {user.isOnline ? "🟢" : "⚫"}
                      </span>
                    </div>

                    <div className="space-y-2 pt-3 border-t">
                      <div className="flex items-center text-xs">
                        <Icon icon="mdi:identifier" className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">ID: {user.id.substring(0, 12)}...</span>
                      </div>
                      {user.providers && user.providers.length > 0 && (
                        <div className="flex items-center text-xs">
                          <Icon icon="mdi:link-variant" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                          <div className="flex gap-1 flex-wrap">
                            {user.providers.map((provider, idx) => (
                              <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                <Icon icon={getProviderIcon(provider)} width="12" />
                                {getProviderName(provider)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-xs">
                        <Icon icon="mdi:clock-outline" className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{formatDate(user.lastLogin)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <Icon icon="mdi:account-off" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">No se encontraron usuarios</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* TABLA DE SESIONES - Desktop */}
        {activeTab === "sessions" && (
          <>
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Usuario
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Método
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Entrada
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">
                        Salida
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Duración
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4">
                            <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                              {session.displayName || "Sin nombre"}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                              {session.email}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Icon icon={getProviderIcon(session.provider)} width="18" />
                              <span className="text-sm truncate">{getProviderName(session.provider)}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden lg:table-cell whitespace-nowrap">
                            {formatDate(session.loginTime)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden xl:table-cell whitespace-nowrap">
                            {session.logoutTime ? formatDate(session.logoutTime) : "Activa"}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell whitespace-nowrap">
                            {session.duration ? formatDuration(session.duration) : "En curso..."}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${session.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}>
                              {session.isActive ? "🟢 Activa" : "⚫ Fin"}
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

            {/* CARDS DE SESIONES - Mobile */}
            <div className="md:hidden space-y-4">
              {paginatedData.length > 0 ? (
                paginatedData.map((session) => (
                  <div key={session.id} className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon icon={getProviderIcon(session.provider)} width="20" className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {session.displayName || "Sin nombre"}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">{session.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${session.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                        {session.isActive ? "🟢" : "⚫"}
                      </span>
                    </div>

                    <div className="space-y-2 pt-3 border-t">
                      <div className="flex items-center text-xs">
                        <Icon icon="mdi:login" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{formatDate(session.loginTime)}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Icon icon="mdi:logout" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">
                          {session.logoutTime ? formatDate(session.logoutTime) : "Sesión activa"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Icon icon="mdi:timer-outline" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {session.duration ? formatDuration(session.duration) : "En curso..."}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <Icon icon="mdi:clock-alert-outline" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">No se encontraron sesiones</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
            <div className="text-xs sm:text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1 text-xs sm:text-sm ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Icon icon="mdi:chevron-left" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex gap-1">
                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 text-xs sm:text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-2 rounded-lg transition text-xs sm:text-sm ${currentPage === page
                          ? "bg-blue-500 text-white font-semibold"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1 text-xs sm:text-sm ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="hidden sm:inline">Siguiente</span>
                <Icon icon="mdi:chevron-right" className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}