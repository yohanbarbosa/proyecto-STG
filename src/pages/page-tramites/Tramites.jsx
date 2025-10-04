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
  const [modalMode, setModalMode] = useState("crear"); // 'crear' o 'editar'
  const [selectedTramite, setSelectedTramite] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    tipo_tramite: "",
    solicitante: "",
    email: "",
    telefono: "",
    departamento: "",
    estado: "pendiente",
    descripcion: "",
    fechaCreado: "",
    fechaActualizado: "",
  });

  //funcion flecha anonima usada para traer los datos
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
  
    // Limpieza: cancelar suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  // CREAR TRÁMITE (CREATE)
  const crearTramite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nuevoTramite = {
        ...formData,
        fechaCreado: new Date().toISOString(),
        fechaActualizado: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "Tramites"), nuevoTramite);
      console.log("Documento creado con ID: ", docRef.id);
      cerrarModal();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error al crear trámite:", error);
      setLoading(false);
    }
  };

  // ACTUALIZAR TRÁMITE (UPDATE)
  const actualizarTramite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tramiteRef = doc(db, "Tramites", selectedTramite.id);
      const dataToUpdate = {
        ...formData,
        fechaActualizado: new Date().toISOString(),
      };
      await updateDoc(tramiteRef, dataToUpdate);
      cerrarModal();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar trámite:", error);
      setLoading(false);
    }
  };

  // ELIMINAR TRÁMITE (DELETE)
  const eliminarTramite = async () => {
    setLoading(true);

    try {
      await deleteDoc(doc(db, "Tramites", selectedTramite.id));

      setShowDeleteModal(false);
      setSelectedTramite(null);
      setLoading(false);
    } catch (error) {
      console.error("Error al eliminar trámite:", error);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "procesando":
        return "bg-blue-100 text-blue-800";
      case "completado":
        return "bg-green-100 text-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return "mdi:clock-outline";
      case "procesando":
        return "mdi:progress-clock";
      case "completado":
        return "mdi:check-circle-outline";
      case "rechazado":
        return "mdi:close-circle-outline";
      default:
        return "mdi:file-document-outline";
    }
  };

  return (
    <AppLayout>
      <div>
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={abrirModalCrear}
            className=" bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            <span>Nuevo Trámite</span>
          </button>
        </div>
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Trámite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creacion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Actualizado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tramites.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
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
                    tramites.map((tramite) => (
                      <tr key={tramite.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Icon
                                icon="mdi:account"
                                className="w-5 h-5 text-blue-600"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {tramite.solicitante}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {tramite.tipo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tramite.descripcion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {tramite.departamento}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {tramite.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tramite.telefono}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              tramite.estado
                            )}`}
                          >
                            <Icon
                              icon={getStatusIcon(tramite.estado)}
                              className="w-4 h-4"
                            />
                            <span className="capitalize">{tramite.estado}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tramite.fechaCreado? new Date(tramite.fechaCreado).toLocaleDateString("es-ES"): "Sin fecha"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tramite.fechaActualizado? new Date(tramite.fechaActualizado).toLocaleDateString("es-ES"): "Sin fecha"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
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
        )}

        {/* MODAL CREAR/EDITAR */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalMode === "crear" ? "Nuevo Trámite" : "Editar Trámite"}
                  </h2>
                  <button
                    onClick={cerrarModal}
                    className="text-gray-400 hover:text-gray-600"
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
                    {/* Tipo de Trámite */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Trámite *
                      </label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Licencia de Construcción">
                          Licencia de Construcción
                        </option>
                        <option value="Permiso de Funcionamiento">
                          Permiso de Funcionamiento
                        </option>
                        <option value="Certificado de Residencia">
                          Certificado de Residencia
                        </option>
                        <option value="Registro Mercantil">
                          Registro Mercantil
                        </option>
                        <option value="Licencia Ambiental">
                          Licencia Ambiental
                        </option>
                      </select>
                    </div>

                    {/* Solicitante */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Solicitante *
                      </label>
                      <input
                        type="text"
                        name="solicitante"
                        value={formData.solicitante}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    {/* Email y Teléfono */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="555-0123"
                        />
                      </div>
                    </div>

                    {/* Departamento y Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Departamento *
                        </label>
                        <select
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccione departamento</option>
                          <option value="Urbanismo">Urbanismo</option>
                          <option value="Comercio">Comercio</option>
                          <option value="Registro Civil">Registro Civil</option>
                          <option value="Medio Ambiente">Medio Ambiente</option>
                          <option value="Hacienda">Hacienda</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado *
                        </label>
                        <select
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="completado">Completado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción *
                      </label>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describa el trámite solicitado..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
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
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="w-6 h-6 text-red-600"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar trámite?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Está seguro de que desea eliminar el trámite de{" "}
                <strong>{selectedTramite.solicitante}</strong>? Esta acción no
                se puede deshacer.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarTramite}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
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
