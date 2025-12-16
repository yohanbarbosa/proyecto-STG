import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Topbar from "../../components/Topbar.jsx";
import { useAuth } from "../../context/AuthProvider";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";
import NuevoTramite from "../page-tramite-user/NuevoTramite.jsx";

const useTramites = () => {
  const { user } = useAuth();
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTramites = async () => {
      try {
        const q = query(
          collection(db, "Tramites"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            fechaCreado: d.fechaCreado?.toDate(),
            fechaActualizado: d.fechaActualizado?.toDate(),
          };
        });

        setTramites(data);
      } catch (error) {
        console.error("Error obteniendo trámites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTramites();
  }, [user]);

  return { tramites, loading };
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { tramites, loading } = useTramites();
  const [activeTab, setActiveTab] = useState("resumen");
  const [editMode, setEditMode] = useState(false);
  const [showNuevoTramite, setShowNuevoTramite] = useState(false);

  const handleTramiteCreated = () => {
    // Recargar los trámites
    window.location.reload(); // O mejor aún, actualiza el estado directamente
  };

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    telefono: "3001234567",
  });

  // Estadísticas
  const stats = {
    total: tramites.length,
    enProceso: tramites.filter((t) => t.estado === "procesando").length,
    aprobados: tramites.filter((t) => t.estado === "aprobado").length,
    rechazados: tramites.filter((t) => t.estado === "rechazado").length,
  };

  const getEstadoColor = (estado) => {
    const colores = {
      procesando: "bg-yellow-100 text-yellow-800",
      aprobado: "bg-green-100 text-green-800",
      rechazado: "bg-red-100 text-red-800",
      pendiente: "bg-blue-100 text-blue-800",
    };
    return colores[estado] || "bg-gray-100 text-gray-800";
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "aprobado":
        return "mdi:check-circle";
      case "rechazado":
        return "mdi:alert-circle";
      default:
        return "mdi:clock-outline";
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("Actualizando perfil:", profileData);
    setEditMode(false);
    alert("Perfil actualizado correctamente");
  };

  // Mostrar loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon
              icon="mdi:loading"
              className="w-12 h-12 animate-spin mx-auto text-blue-600"
            />
            <p className="mt-4 text-gray-600">Cargando información...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar user={user} />

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab("resumen")}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "resumen"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab("tramites")}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "tramites"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Mis Trámites
            </button>
            <button
              onClick={() => setActiveTab("perfil")}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "perfil"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Mi Perfil
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Tab: Resumen */}
        {activeTab === "resumen" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Total Trámites
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {stats.total}
                    </p>
                  </div>
                  <Icon
                    icon="mdi:file-document-multiple"
                    className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      En Proceso
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                      {stats.enProceso}
                    </p>
                  </div>
                  <Icon
                    icon="mdi:clock-outline"
                    className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Aprobados
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                      {stats.aprobados}
                    </p>
                  </div>
                  <Icon
                    icon="mdi:check-circle"
                    className="w-6 h-6 sm:w-8 sm:h-8 text-green-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Rechazados
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                      {stats.rechazados}
                    </p>
                  </div>
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="mdi:account"
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {user?.displayName || "Usuario"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="mdi:email"
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trámites Recientes */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Trámites Recientes
                </h2>
                <button
                  onClick={() => setActiveTab("tramites")}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todos
                </button>
              </div>
              {tramites.length === 0 ? (
                <div className="text-center py-8">
                  <Icon
                    icon="mdi:file-document-outline"
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                  />
                  <p className="text-gray-500 text-sm">
                    No tienes trámites registrados
                  </p>
                  <button
                    onClick={() => setActiveTab("tramites")}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Crear tu primer trámite
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tramites.slice(0, 3).map((tramite) => (
                    <div
                      key={tramite.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2 sm:gap-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {tramite.tipo}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {tramite.departamento}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Creado:{" "}
                          {tramite.fechaCreado?.toLocaleDateString() ||
                            "Sin fecha"}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getEstadoColor(
                          tramite.estado
                        )}`}
                      >
                        <Icon
                          icon={getEstadoIcon(tramite.estado)}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <span className="capitalize">{tramite.estado}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Mis Trámites */}
        {activeTab === "tramites" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Botón Nuevo Trámite */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Mis Trámites
              </h2>
              <button
                onClick={() => setShowNuevoTramite(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Icon icon="mdi:plus" className="w-5 h-5" />
                <span>Nuevo Trámite</span>
              </button>
            </div>

            {/* Lista de Trámites con Timeline */}
            {tramites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <Icon
                  icon="mdi:file-document-outline"
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes trámites
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando tu primer trámite
                </p>
                <button
                 onClick={() => setShowNuevoTramite(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                  <Icon icon="mdi:plus" className="w-5 h-5" />
                  <span>Crear Trámite</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tramites.map((tramite) => (
                  <div
                    key={tramite.id}
                    className="bg-white rounded-lg shadow-sm border p-4 sm:p-6"
                  >
                    {/* Header del Trámite */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2 sm:gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {tramite.tipo}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          {tramite.departamento}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getEstadoColor(
                          tramite.estado
                        )}`}
                      >
                        <Icon
                          icon={getEstadoIcon(tramite.estado)}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <span className="capitalize">{tramite.estado}</span>
                      </span>
                    </div>

                    {/* Información del Trámite */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                      <div>
                        <p className="text-xs text-gray-500">Creación</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                          {tramite.fechaCreado?.toLocaleDateString() ||
                            "Sin fecha"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Actualización</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                          {tramite.fechaActualizado?.toLocaleDateString() ||
                            "Sin fecha"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha Límite</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                          {tramite.fechaLimite || "Sin definir"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Solicitante</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                          {tramite.solicitante || user?.displayName}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                        Línea de Tiempo
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        {/* Etapa 1: Solicitud Recibida */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              tramite.etapaActual >= 1
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {tramite.etapaActual >= 1 ? (
                              <Icon
                                icon="mdi:check-circle"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : (
                              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              Solicitud Recibida
                            </p>
                            <p className="text-xs text-gray-500">
                              Trámite registrado en el sistema
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {tramite.fechaCreado?.toLocaleDateString() || "N/A"}
                          </span>
                        </div>

                        {/* Conexión vertical */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0 w-7 sm:w-8 flex justify-center">
                            <div
                              className={`w-0.5 h-6 sm:h-8 ${
                                tramite.etapaActual >= 2
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Etapa 2: En Revisión */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              tramite.etapaActual >= 2
                                ? "bg-green-500"
                                : tramite.etapaActual === 1
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {tramite.etapaActual >= 2 ? (
                              <Icon
                                icon="mdi:check-circle"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : tramite.etapaActual === 1 ? (
                              <Icon
                                icon="mdi:clock-outline"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : (
                              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              En Revisión
                            </p>
                            <p className="text-xs text-gray-500">
                              Documentación siendo verificada
                            </p>
                          </div>
                          {tramite.etapaActual >= 2 && (
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {tramite.fechaActualizado?.toLocaleDateString() ||
                                "N/A"}
                            </span>
                          )}
                        </div>

                        {/* Conexión vertical */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0 w-7 sm:w-8 flex justify-center">
                            <div
                              className={`w-0.5 h-6 sm:h-8 ${
                                tramite.etapaActual >= 3
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Etapa 3: Aprobación */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              tramite.etapaActual >= 3
                                ? "bg-green-500"
                                : tramite.etapaActual === 2
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {tramite.etapaActual >= 3 ? (
                              <Icon
                                icon="mdi:check-circle"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : tramite.etapaActual === 2 ? (
                              <Icon
                                icon="mdi:clock-outline"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : (
                              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              Aprobación
                            </p>
                            <p className="text-xs text-gray-500">
                              Esperando aprobación final
                            </p>
                          </div>
                        </div>

                        {/* Conexión vertical */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0 w-7 sm:w-8 flex justify-center">
                            <div
                              className={`w-0.5 h-6 sm:h-8 ${
                                tramite.etapaActual >= 4
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Etapa 4: Completado */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              tramite.etapaActual >= 4
                                ? "bg-green-500"
                                : tramite.etapaActual === 3
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {tramite.etapaActual >= 4 ? (
                              <Icon
                                icon="mdi:check-circle"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : tramite.etapaActual === 3 ? (
                              <Icon
                                icon="mdi:clock-outline"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              />
                            ) : (
                              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              Completado
                            </p>
                            <p className="text-xs text-gray-500">
                              Trámite finalizado
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    {tramite.descripcion && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs sm:text-sm text-gray-600">
                          <strong>Descripción:</strong> {tramite.descripcion}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Mi Perfil */}
        {activeTab === "perfil" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Mi Perfil
                </h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Icon icon="mdi:pencil" className="w-4 h-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        displayName: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El correo no puede ser modificado
                  </p>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={profileData.telefono}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        telefono: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
                  />
                </div>

                {/* Botones */}
                {editMode && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                    <button
                      onClick={handleUpdateProfile}
                      className="w-full sm:flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setProfileData({
                          displayName: user?.displayName || "",
                          email: user?.email || "",
                          telefono: "3001234567",
                        });
                      }}
                      className="w-full sm:flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showNuevoTramite && (
        <NuevoTramite
          onClose={() => setShowNuevoTramite(false)}
          onSuccess={handleTramiteCreated}
        />
      )}
    </div>
  );
};

export default UserDashboard;
