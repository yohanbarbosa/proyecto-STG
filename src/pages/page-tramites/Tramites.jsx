import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AppLayout from "../../components/AppLayout";
import { db } from "../../firebase";
import { Icon } from "@iconify/react";

function TramitesList() {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear");
  const [selectedTramite, setSelectedTramite] = useState(null);

  const [formData, setFormData] = useState({
    tipo: "",
    solicitante: "",
    email: "",
    telefono: "",
    departamento: "",
    estado: "pendiente",
    descripcion: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Tramites"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTramites(data);
      },
      (error) => {
        console.error("Error al escuchar trámites:", error);
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
        fechaCreado: new Date().toISOString(),
        fechaActualizado: new Date().toISOString(),
      };
      await addDoc(collection(db, "Tramites"), nuevoTramite);
      cerrarModal();
      resetForm();
    } catch (error) {
      console.error("Error al crear trámite:", error);
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
        fechaActualizado: new Date().toISOString(),
      });
      cerrarModal();
      resetForm();
    } catch (error) {
      console.error("Error al actualizar trámite:", error);
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
      descripcion: tramite.descripcion,
    });
    setShowModal(true);
  };

  const abrirModalEliminar = (tramite) => {
    setSelectedTramite(tramite);
    setShowDeleteModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedTramite(null);
  };

  const resetForm = () => {
    setFormData({
      tipo: "",
      solicitante: "",
      email: "",
      telefono: "",
      departamento: "",
      estado: "pendiente",
      descripcion: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      procesando: "bg-blue-100 text-blue-800",
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
          <button
            onClick={abrirModalCrear}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            <span>Nuevo Trámite</span>
          </button>
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
                        Contacto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">
                        Fecha Creación
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tramites.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          <Icon icon="mdi:file-document-outline" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>No se encontraron trámites</p>
                        </td>
                      </tr>
                    ) : (
                      tramites.map((tramite) => (
                        <tr key={tramite.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon icon="mdi:account" className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {tramite.solicitante}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{tramite.tipo}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                              {tramite.descripcion}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{tramite.departamento}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{tramite.email}</div>
                            <div className="text-xs text-gray-500">{tramite.telefono}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tramite.estado)}`}>
                              <Icon icon={getStatusIcon(tramite.estado)} className="w-4 h-4" />
                              <span className="capitalize">{tramite.estado}</span>
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                            {tramite.fechaCreado ? new Date(tramite.fechaCreado).toLocaleDateString("es-ES") : "Sin fecha"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => abrirModalEditar(tramite)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              >
                                <Icon icon="mdi:pencil-outline" className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => abrirModalEliminar(tramite)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              >
                                <Icon icon="mdi:delete-outline" className="w-5 h-5" />
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

            {/* Vista Mobile/Tablet - Cards */}
            <div className="lg:hidden space-y-4">
              {tramites.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <Icon icon="mdi:file-document-outline" className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">No se encontraron trámites</p>
                </div>
              ) : (
                tramites.map((tramite) => (
                  <div key={tramite.id} className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon icon="mdi:account" className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {tramite.solicitante}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">{tramite.tipo}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(tramite.estado)}`}>
                        <Icon icon={getStatusIcon(tramite.estado)} className="w-3 h-3" />
                        <span className="capitalize">{tramite.estado}</span>
                      </span>
                    </div>

                    {/* Detalles */}
                    <div className="space-y-2 pt-3 border-t">
                      <div className="flex items-start text-xs">
                        <Icon icon="mdi:office-building" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tramite.departamento}</span>
                      </div>
                      <div className="flex items-start text-xs">
                        <Icon icon="mdi:email" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 truncate">{tramite.email}</span>
                      </div>
                      <div className="flex items-start text-xs">
                        <Icon icon="mdi:phone" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tramite.telefono}</span>
                      </div>
                      <div className="flex items-start text-xs">
                        <Icon icon="mdi:text" className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 line-clamp-2">{tramite.descripcion}</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2 pt-3 border-t">
                      <button
                        onClick={() => abrirModalEditar(tramite)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => abrirModalEliminar(tramite)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
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

        {/* MODAL CREAR/EDITAR */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {modalMode === "crear" ? "Nuevo Trámite" : "Editar Trámite"}
                  </h2>
                  <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600 p-1">
                    <Icon icon="mdi:close" className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={modalMode === "crear" ? crearTramite : actualizarTramite}>
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
                        <option value="Permiso de Funcionamiento">Permiso de Funcionamiento</option>
                        <option value="Certificado de Residencia">Certificado de Residencia</option>
                        <option value="Registro Mercantil">Registro Mercantil</option>
                        <option value="Licencia Ambiental">Licencia Ambiental</option>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="555-0123"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Departamento *</label>
                        <select
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Seleccione</option>
                          <option value="Urbanismo">Urbanismo</option>
                          <option value="Comercio">Comercio</option>
                          <option value="Registro Civil">Registro Civil</option>
                          <option value="Medio Ambiente">Medio Ambiente</option>
                          <option value="Hacienda">Hacienda</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado *</label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción *</label>
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

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t">
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
                          <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:content-save" className="w-5 h-5" />
                          <span>{modalMode === "crear" ? "Crear Trámite" : "Guardar"}</span>
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
                <Icon icon="mdi:alert-circle-outline" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar trámite?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                ¿Está seguro de eliminar el trámite de{" "}
                <strong className="text-gray-900">{selectedTramite.solicitante}</strong>?
              </p>
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
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
                      <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
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