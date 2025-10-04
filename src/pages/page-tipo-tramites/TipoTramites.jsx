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

function TipoTramites() {
  const [tipoTramites, setTipoTramites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear"); // 'crear' o 'editar'
  const [selectedTipoTramite, setSelectedTipoTramite] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: "",
    estado: true,
  });

  // Traer los datos de tipo-tramites
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tipo-tramites"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTipoTramites(data);
      },
      (error) => {
        console.error("Error al escuchar tipos de trámites:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // CREAR TIPO DE TRÁMITE (CREATE)
  const crearTipoTramite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ahora = new Date();
      const fechaFormateada = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
      
      const nuevoTipoTramite = {
        ...formData,
        fechaCreacion: fechaFormateada,
        ultimaActualizacion: fechaFormateada,
      };
      const docRef = await addDoc(
        collection(db, "tipo-tramites"),
        nuevoTipoTramite
      );
      console.log("Documento creado con ID: ", docRef.id);
      cerrarModal();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error al crear tipo de trámite:", error);
      setLoading(false);
    }
  };

  // ACTUALIZAR TIPO DE TRÁMITE (UPDATE)
  const actualizarTipoTramite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ahora = new Date();
      const fechaFormateada = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
      
      const tipoTramiteRef = doc(db, "tipo-tramites", selectedTipoTramite.id);
      const dataToUpdate = {
        ...formData,
        ultimaActualizacion: fechaFormateada,
      };
      await updateDoc(tipoTramiteRef, dataToUpdate);
      cerrarModal();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar tipo de trámite:", error);
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setModalMode("crear");
    resetForm();
    setShowModal(true);
  };

  const abrirModalEditar = (tipoTramite) => {
    setModalMode("editar");
    setSelectedTipoTramite(tipoTramite);
    setFormData({
      nombre: tipoTramite.nombre,
      estado: tipoTramite.estado,
    });
    setShowModal(true);
  };

  const abrirModalEliminar = (tipoTramite) => {
    setSelectedTipoTramite(tipoTramite);
    setShowDeleteModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedTipoTramite(null);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      estado: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <AppLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Tipos de Trámites
          </h1>
          <button
            onClick={abrirModalCrear}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            <span>Nuevo Tipo</span>
          </button>
        </div>


          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Trámite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actualización
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tipoTramites.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Icon
                          icon="mdi:file-document-multiple-outline"
                          className="w-12 h-12 mx-auto mb-2 text-gray-400"
                        />
                        <p>No se encontraron tipos de trámites</p>
                      </td>
                    </tr>
                  ) : (
                    tipoTramites.map((tipoTramite) => (
                      <tr key={tipoTramite.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Icon
                                icon="mdi:file-document-outline"
                                className="w-5 h-5 text-purple-600"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {tipoTramite.nombre}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tipoTramite.estado
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <Icon
                              icon={
                                tipoTramite.estado
                                  ? "mdi:check-circle-outline"
                                  : "mdi:close-circle-outline"
                              }
                              className="w-4 h-4"
                            />
                            <span>
                              {tipoTramite.estado ? "Activo" : "Inactivo"}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tipoTramite.fechaCreacion || "Sin fecha"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tipoTramite.ultimaActualizacion || "Sin fecha"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => abrirModalEditar(tipoTramite)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Editar"
                            >
                              <Icon
                                icon="mdi:pencil-outline"
                                className="w-5 h-5"
                              />
                            </button>
                            <button
                              onClick={() => abrirModalEliminar(tipoTramite)}
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
        

        {/* MODAL CREAR/EDITAR */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalMode === "crear"
                      ? "Nuevo Tipo de Trámite"
                      : "Editar Tipo de Trámite"}
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
                    modalMode === "crear"
                      ? crearTipoTramite
                      : actualizarTipoTramite
                  }
                >
                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Trámite *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Licencia de construcción"
                      />
                    </div>

                    {/* Estado */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="estado"
                        id="estado"
                        checked={formData.estado}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="estado"
                        className="text-sm font-medium text-gray-700"
                      >
                        Tipo de trámite activo
                      </label>
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
                              ? "Crear Tipo"
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
      </div>
    </AppLayout>
  );
}

export default TipoTramites;