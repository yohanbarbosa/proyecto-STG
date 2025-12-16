import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import AppLayout from "../../components/AppLayout";
import { db } from "../../firebase";
import { Icon } from "@iconify/react";
import ExportExcel from "../../components/ExportExcel";
import ExportPdf from "../../components/ExportPdf";

function TramitesList() {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear");
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    tipo: "",
    solicitante: "",
    email: "",
    telefono: "",
    departamento: "",
    estado: "pendiente",
    estadoActual: "Solicitud Recibida",
    etapaActual: 1,
    descripcion: "",
    fechaLimite: "",
  });

  // Estados disponibles
  const estados = [
    { value: "pendiente", label: "Pendiente", color: "blue" },
    { value: "procesando", label: "Procesando", color: "yellow" },
    { value: "completado", label: "Completado", color: "green" },
    { value: "rechazado", label: "Rechazado", color: "red" },
  ];

  // Etapas del proceso
  const etapas = [
    { value: 1, label: "Solicitud Recibida", descripcion: "Trámite registrado en el sistema" },
    { value: 2, label: "En Revisión", descripcion: "Documentación siendo verificada" },
    { value: 3, label: "En Aprobación", descripcion: "Esperando aprobación final" },
    { value: 4, label: "Completado", descripcion: "Trámite finalizado" },
  ];

  // Tipos de trámites
  const tiposTramite = [
    "Licencia de Construcción",
    "Certificado de Tradición",
    "Registro Civil",
    "Cédula de Ciudadanía",
    "Pasaporte",
    "Permiso de Funcionamiento",
    "Certificado de Antecedentes",
    "Licencia de Conducción",
    "Registro Mercantil",
    "Certificado de Uso de Suelo",
    "Permiso Ambiental",
    "Otro",
  ];

  // Departamentos de Colombia
  const departamentos = [
    "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar",
    "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca",
    "Cesar", "Chocó", "Comercio", "Córdoba", "Cundinamarca",
    "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
    "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío",
    "Risaralda", "San Andrés y Providencia", "Santander", "Sucre",
    "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Tramites"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            fechaCreado: d.fechaCreado?.toDate?.() || (d.fechaCreado ? new Date(d.fechaCreado) : null),
            fechaActualizado: d.fechaActualizado?.toDate?.() || (d.fechaActualizado ? new Date(d.fechaActualizado) : null),
          };
        });
        setTramites(data);
      },
      (error) => {
        console.error("Error al traer trámites:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const crearTramite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nuevoTramite = {
        ...formData,
        fechaCreado: serverTimestamp(),
        fechaActualizado: serverTimestamp(),
      };
      await addDoc(collection(db, "Tramites"), nuevoTramite);
      cerrarModal();
      resetForm();
    } catch (error) {
      console.error("Error al crear trámite:", error);
      alert("Error al crear el trámite");
    } finally {
      setLoading(false);
    }
  };

  const actualizarTramite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tramiteRef = doc(db, "Tramites", selectedTramite.id);
      await updateDoc(tramiteRef, {
        ...formData,
        fechaActualizado: serverTimestamp(),
      });
      cerrarModal();
      resetForm();
    } catch (error) {
      console.error("Error al actualizar trámite:", error);
      alert("Error al actualizar el trámite");
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tramiteRef = doc(db, "Tramites", selectedTramite.id);
      await updateDoc(tramiteRef, {
        estado: formData.estado,
        estadoActual: formData.estadoActual,
        etapaActual: formData.etapaActual,
        fechaActualizado: serverTimestamp(),
      });
      setShowStatusModal(false);
      setSelectedTramite(null);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado");
    } finally {
      setLoading(false);
    }
  };

  const eliminarTramite = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "Tramites", selectedTramite.id));
      setShowDeleteModal(false);
      setSelectedTramite(null);
    } catch (error) {
      console.error("Error al eliminar trámite:", error);
      alert("Error al eliminar el trámite");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setModalMode("crear");
    resetForm();
    setShowModal(true);
  };

  const abrirModalEditar = (tramite) => {
    setModalMode("editar");
    setSelectedTramite(tramite);
    setFormData({
      tipo: tramite.tipo,
      solicitante: tramite.solicitante,
      email: tramite.email,
      telefono: tramite.telefono,
      departamento: tramite.departamento,
      estado: tramite.estado,
      estadoActual: tramite.estadoActual || "Solicitud Recibida",
      etapaActual: tramite.etapaActual || 1,
      descripcion: tramite.descripcion,
      fechaLimite: tramite.fechaLimite || "",
    });
    setShowModal(true);
  };

  const abrirModalEstado = (tramite) => {
    setSelectedTramite(tramite);
    setFormData({
      ...formData,
      estado: tramite.estado,
      estadoActual: tramite.estadoActual || "Solicitud Recibida",
      etapaActual: tramite.etapaActual || 1,
    });
    setShowStatusModal(true);
  };

  const abrirModalEliminar = (tramite) => {
    setSelectedTramite(tramite);
    setShowDeleteModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedTramite(null);
  };

  const filteredTramites = tramites.filter((t) =>
    (t.solicitante + " " + t.tipo + " " + t.departamento + " " + t.estado)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      tipo: "",
      solicitante: "",
      email: "",
      telefono: "",
      departamento: "",
      estado: "pendiente",
      estadoActual: "Solicitud Recibida",
      etapaActual: 1,
      descripcion: "",
      fechaLimite: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia la etapa, actualizar automáticamente el estadoActual
    if (name === "etapaActual") {
      const etapa = etapas.find(e => e.value === parseInt(value));
      setFormData((prev) => ({ 
        ...prev, 
        [name]: parseInt(value),
        estadoActual: etapa ? etapa.label : prev.estadoActual
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: "bg-blue-100 text-blue-800",
      procesando: "bg-yellow-100 text-yellow-800",
      completado: "bg-green-100 text-green-800",
      rechazado: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pendiente: "mdi:clock-outline",
      procesando: "mdi:progress-clock",
      completado: "mdi:check-circle-outline",
      rechazado: "mdi:close-circle-outline",
    };
    return icons[status] || "mdi:file-document-outline";
  };

  const formatFecha = (fecha) => {
  if (!fecha) return "—";

  // Firestore Timestamp
  if (typeof fecha === "object" && fecha.seconds) {
    return new Date(fecha.seconds * 1000).toLocaleDateString();
  }

  // Date normal
  if (fecha instanceof Date) {
    return fecha.toLocaleDateString();
  }

  // String o número
  return new Date(fecha).toLocaleDateString();
};


  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Gestión de Trámites
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Administra las solicitudes de trámites
            </p>
          </div>
          <div className="flex gap-3">
            <ExportExcel data={filteredTramites} fileName="tramites" />
            <ExportPdf data={filteredTramites} fileName="tramites" />
            <button
              onClick={abrirModalCrear}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm text-sm"
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
              <span>Nuevo Trámite</span>
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
              placeholder="Buscar trámites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon icon="mdi:close-circle" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Contador */}
        <div className="text-xs sm:text-sm text-gray-600">
          Mostrando {filteredTramites.length} de {tramites.length} trámites
          {search && ` (filtrado)`}
        </div>

        {!loading && (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Solicitante
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tipo de Trámite
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Departamento
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado / Etapa
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha Límite
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTramites.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <Icon
                            icon="mdi:file-document-outline"
                            className="w-12 h-12 mx-auto mb-2 text-gray-400"
                          />
                          <p>No se encontraron trámites</p>
                        </td>
                      </tr>
                    ) : (
                      filteredTramites.map((tramite) => (
                        <tr key={tramite.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon
                                  icon="mdi:account"
                                  className="w-5 h-5 text-blue-600"
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {tramite.solicitante}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {tramite.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {tramite.tipo}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                              {tramite.descripcion}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {tramite.departamento}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  tramite.estado
                                )}`}
                              >
                                <Icon
                                  icon={getStatusIcon(tramite.estado)}
                                  className="w-3 h-3"
                                />
                                <span className="capitalize">
                                  {tramite.estado}
                                </span>
                              </span>
                              <div className="text-xs text-gray-600">
                                Etapa {tramite.etapaActual || 1}: {tramite.estadoActual || "Solicitud Recibida"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFecha(tramite.fechaLimite)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => abrirModalEstado(tramite)}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                                title="Cambiar estado"
                              >
                                <Icon
                                  icon="mdi:swap-horizontal"
                                  className="w-5 h-5"
                                />
                              </button>
                              <button
                                onClick={() => abrirModalEditar(tramite)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Editar"
                              >
                                <Icon
                                  icon="mdi:pencil-outline"
                                  className="w-5 h-5"
                                />
                              </button>
                              <button
                                onClick={() => abrirModalEliminar(tramite)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Eliminar"
                              >
                                <Icon
                                  icon="mdi:delete-outline"
                                  className="w-5 h-5"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="lg:hidden space-y-4">
              {filteredTramites.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <Icon
                    icon="mdi:file-document-outline"
                    className="w-12 h-12 mx-auto mb-3 text-gray-400"
                  />
                  <p className="text-gray-500">No se encontraron trámites</p>
                </div>
              ) : (
                filteredTramites.map((tramite) => (
                  <div
                    key={tramite.id}
                    className="bg-white rounded-lg shadow-sm border p-4 space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon
                            icon="mdi:account"
                            className="w-5 h-5 text-blue-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {tramite.solicitante}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {tramite.tipo}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(
                          tramite.estado
                        )}`}
                      >
                        <Icon
                          icon={getStatusIcon(tramite.estado)}
                          className="w-3 h-3"
                        />
                        <span className="capitalize">{tramite.estado}</span>
                      </span>
                    </div>

                    {/* Estado/Etapa */}
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-xs font-medium text-gray-700">
                        Etapa {tramite.etapaActual || 1} de 4
                      </div>
                      <div className="text-xs text-gray-600">
                        {tramite.estadoActual || "Solicitud Recibida"}
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-start text-xs">
                        <Icon
                          icon="mdi:office-building"
                          className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700">
                          {tramite.departamento}
                        </span>
                      </div>
                      <div className="flex items-start text-xs">
                        <Icon
                          icon="mdi:calendar"
                          className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700">
                          Límite: {formatFecha(tramite.fechaLimite)}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2 pt-3 border-t">
                      <button
                        onClick={() => abrirModalEstado(tramite)}
                        className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"
                      >
                        <Icon icon="mdi:swap-horizontal" className="w-4 h-4" />
                        <span>Estado</span>
                      </button>
                      <button
                        onClick={() => abrirModalEditar(tramite)}
                        className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                      >
                        <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => abrirModalEliminar(tramite)}
                        className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                      >
                        <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* MODAL CAMBIAR ESTADO */}
        {showStatusModal && selectedTramite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon icon="mdi:swap-horizontal" className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Cambiar Estado
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedTramite.solicitante}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon="mdi:close" className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={actualizarEstado}>
                  <div className="space-y-4">
                    {/* Estado General */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado General *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {estados.map((estado) => (
                          <button
                            key={estado.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, estado: estado.value })}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              formData.estado === estado.value
                                ? `border-${estado.color}-500 bg-${estado.color}-50 text-${estado.color}-700`
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {estado.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Etapa del Proceso */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etapa del Proceso *
                      </label>
                      <select
                        name="etapaActual"
                        value={formData.etapaActual}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        {etapas.map((etapa) => (
                          <option key={etapa.value} value={etapa.value}>
                            Etapa {etapa.value}: {etapa.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1.5">
                        {etapas.find(e => e.value === formData.etapaActual)?.descripcion}
                      </p>
                    </div>

                    {/* Descripción del Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Descripción del Estado Actual
                      </label>
                      <input
                        type="text"
                        name="estadoActual"
                        value={formData.estadoActual}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        placeholder="Ej: Documentos en revisión"
                      />
                    </div>

                    {/* Resumen Visual */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="text-xs font-medium text-gray-700">Resumen del cambio:</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor(formData.estado)}`}>
                          {formData.estado}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Etapa:</span>
                        <span className="font-medium text-gray-900">
                          {formData.etapaActual} de 4
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {formData.estadoActual}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowStatusModal(false)}
                      className="w-full sm:flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      {loading ? (
                        <>
                          <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                          <span>Actualizando...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:check" className="w-5 h-5" />
                          <span>Actualizar Estado</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CREAR/EDITAR */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {modalMode === "crear" ? "Nuevo Trámite" : "Editar Trámite"}
                  </h2>
                  <button
                    onClick={cerrarModal}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Icon icon="mdi:close" className="w-6 h-6" />
                  </button>
                </div>

                <form
                  onSubmit={
                    modalMode === "crear" ? crearTramite : actualizarTramite
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tipo de Trámite *
                      </label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Licencia de Construcción">Licencia de Construcción</option>
                        <option value="Certificado de Tradición">Certificado de Tradición</option>
                        <option value="Registro Civil">Registro Civil</option>
                        <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Permiso de Funcionamiento">Permiso de Funcionamiento</option>
                        <option value="Certificado de Antecedentes">Certificado de Antecedentes</option>
                        <option value="Licencia de Conducción">Licencia de Conducción</option>
                        <option value="Registro Mercantil">Registro Mercantil</option>
                        <option value="Certificado de Uso de Suelo">Certificado de Uso de Suelo</option>
                        <option value="Permiso Ambiental">Permiso Ambiental</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre del Solicitante *
                      </label>
                      <input
                        type="text"
                        name="solicitante"
                        value={formData.solicitante}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="3001234567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Departamento *
                        </label>
                        <select
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Seleccione departamento</option>
                          <option value="Amazonas">Amazonas</option>
                          <option value="Antioquia">Antioquia</option>
                          <option value="Arauca">Arauca</option>
                          <option value="Atlántico">Atlántico</option>
                          <option value="Bolívar">Bolívar</option>
                          <option value="Boyacá">Boyacá</option>
                          <option value="Caldas">Caldas</option>
                          <option value="Caquetá">Caquetá</option>
                          <option value="Casanare">Casanare</option>
                          <option value="Cauca">Cauca</option>
                          <option value="Cesar">Cesar</option>
                          <option value="Chocó">Chocó</option>
                          <option value="Comercio">Comercio</option>
                          <option value="Córdoba">Córdoba</option>
                          <option value="Cundinamarca">Cundinamarca</option>
                          <option value="Guainía">Guainía</option>
                          <option value="Guaviare">Guaviare</option>
                          <option value="Huila">Huila</option>
                          <option value="La Guajira">La Guajira</option>
                          <option value="Magdalena">Magdalena</option>
                          <option value="Meta">Meta</option>
                          <option value="Nariño">Nariño</option>
                          <option value="Norte de Santander">Norte de Santander</option>
                          <option value="Putumayo">Putumayo</option>
                          <option value="Quindío">Quindío</option>
                          <option value="Risaralda">Risaralda</option>
                          <option value="San Andrés y Providencia">San Andrés y Providencia</option>
                          <option value="Santander">Santander</option>
                          <option value="Sucre">Sucre</option>
                          <option value="Tolima">Tolima</option>
                          <option value="Valle del Cauca">Valle del Cauca</option>
                          <option value="Vaupés">Vaupés</option>
                          <option value="Vichada">Vichada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Estado *
                        </label>
                        <select
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="completado">Completado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Etapa Actual *
                        </label>
                        <select
                          name="etapaActual"
                          value={formData.etapaActual}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          {etapas.map((etapa) => (
                            <option key={etapa.value} value={etapa.value}>
                              Etapa {etapa.value}: {etapa.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Fecha Límite
                        </label>
                        <input
                          type="date"
                          name="fechaLimite"
                          value={formData.fechaLimite}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Estado Actual (Descripción)
                      </label>
                      <input
                        type="text"
                        name="estadoActual"
                        value={formData.estadoActual}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Ej: Documentos en revisión"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Descripción *
                      </label>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Describa el trámite..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      {loading ? (
                        <>
                          <Icon
                            icon="mdi:loading"
                            className="w-5 h-5 animate-spin"
                          />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:content-save" className="w-5 h-5" />
                          <span>
                            {modalMode === "crear"
                              ? "Crear Trámite"
                              : "Guardar Cambios"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ELIMINAR */}
        {showDeleteModal && selectedTramite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="w-6 h-6 text-red-600"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar trámite?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                ¿Está seguro de eliminar el trámite de{" "}
                <strong className="text-gray-900">
                  {selectedTramite.solicitante}
                </strong>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarTramite}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  {loading ? (
                    <>
                      <Icon
                        icon="mdi:loading"
                        className="w-5 h-5 animate-spin"
                      />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                      <span>Eliminar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default TramitesList;