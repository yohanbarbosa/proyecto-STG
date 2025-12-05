import { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import AppLayout from "../../components/AppLayout";
import { db } from "../../firebase";
import { Icon } from "@iconify/react";
import ExportExcel from "../../components/ExportExcel";
import ExportPdf from "../../components/ExportPdf";

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear");
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    apellidoCompleto: "",
    email: "",
    telefono: "",
    cargo: "",
    estado: true,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "funcionarios"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFuncionarios(data);
      },
      (error) => {
        console.error("Error al escuchar funcionarios:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredFuncionarios = useMemo(() => {
    if (!searchTerm) return funcionarios;

    return funcionarios.filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        item.nombreCompleto?.toLowerCase().includes(search) ||
        item.apellidoCompleto?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.telefono?.toLowerCase().includes(search) ||
        item.cargo?.toLowerCase().includes(search)
      );
    });
  }, [funcionarios, searchTerm]);

  const crearFuncionario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "funcionarios"), {
        ...formData,
        fechaCreacion: Timestamp.now(),
        fechaActualizado: Timestamp.now(),
      });
      cerrarModal();
      resetForm();
    } catch (error) {
      console.error("Error al crear funcionario:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarFuncionario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const funcionarioRef = doc(db, "funcionarios", selectedFuncionario.id);
      await updateDoc(funcionarioRef, {
        ...formData,
        fechaActualizado: Timestamp.now(),
      });
      cerrarModal();
      resetForm();
    } catch (error) {
      console.error("Error al actualizar funcionario:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarFuncionario = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "funcionarios", selectedFuncionario.id));
      setShowDeleteModal(false);
      setSelectedFuncionario(null);
    } catch (error) {
      console.error("Error al eliminar funcionario:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setModalMode("crear");
    resetForm();
    setShowModal(true);
  };

  const abrirModalEditar = (funcionario) => {
    setModalMode("editar");
    setSelectedFuncionario(funcionario);
    setFormData({
      nombreCompleto: funcionario.nombreCompleto,
      apellidoCompleto: funcionario.apellidoCompleto,
      email: funcionario.email,
      telefono: funcionario.telefono,
      cargo: funcionario.cargo,
      estado: funcionario.estado,
    });
    setShowModal(true);
  };

  const abrirModalEliminar = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowDeleteModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedFuncionario(null);
  };

  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      apellidoCompleto: "",
      email: "",
      telefono: "",
      cargo: "",
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "Sin fecha";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-ES");
  };

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Funcionarios
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona el personal del municipio
            </p>
          </div>

          <div className="flex space-x-3">
            <ExportExcel
              data={filteredFuncionarios}
              fileName={searchTerm ? "funcionarios_filtrados" : "funcionarios"}
            />
            <ExportPdf
              data={filteredFuncionarios}
              fileName={searchTerm ? "funcionarios_filtrados" : "funcionarios"}
            />

            <button
              onClick={abrirModalCrear}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base"
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
              <span>Nuevo Funcionario</span>
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y botones de exportación */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Buscar funcionarios..."
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
        </div>

        {/* Contador */}
        <div className="text-xs sm:text-sm text-gray-600">
          Mostrando {filteredFuncionarios.length} de {funcionarios.length}{" "}
          funcionarios
          {searchTerm && ` (filtrado)`}
        </div>

        {!loading && (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Funcionario
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cargo
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contacto
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Creación
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">
                        Actualización
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFuncionarios.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <Icon
                            icon="mdi:account-group-outline"
                            className="w-12 h-12 mx-auto mb-2 text-gray-400"
                          />
                          <p>No se encontraron funcionarios</p>
                        </td>
                      </tr>
                    ) : (
                      filteredFuncionarios.map((funcionario) => (
                        <tr key={funcionario.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon
                                  icon="mdi:account"
                                  className="w-5 h-5 text-blue-600"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {funcionario.nombreCompleto}{" "}
                                  {funcionario.apellidoCompleto}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {funcionario.cargo}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {funcionario.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {funcionario.telefono}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                funcionario.estado
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <Icon
                                icon={
                                  funcionario.estado
                                    ? "mdi:check-circle-outline"
                                    : "mdi:close-circle-outline"
                                }
                                className="w-4 h-4"
                              />
                              <span>
                                {funcionario.estado ? "Activo" : "Inactivo"}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            {formatDate(funcionario.fechaCreacion)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                            {formatDate(funcionario.fechaActualizado)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => abrirModalEditar(funcionario)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              >
                                <Icon
                                  icon="mdi:pencil-outline"
                                  className="w-5 h-5"
                                />
                              </button>
                              <button
                                onClick={() => abrirModalEliminar(funcionario)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
            <div className="md:hidden space-y-4">
              {filteredFuncionarios.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <Icon
                    icon="mdi:account-group-outline"
                    className="w-12 h-12 mx-auto mb-3 text-gray-400"
                  />
                  <p className="text-gray-500">
                    No se encontraron funcionarios
                  </p>
                </div>
              ) : (
                filteredFuncionarios.map((funcionario) => (
                  <div
                    key={funcionario.id}
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
                            {funcionario.nombreCompleto}{" "}
                            {funcionario.apellidoCompleto}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {funcionario.cargo}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                          funcionario.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <Icon
                          icon={
                            funcionario.estado
                              ? "mdi:check-circle-outline"
                              : "mdi:close-circle-outline"
                          }
                          className="w-3 h-3"
                        />
                        <span>
                          {funcionario.estado ? "Activo" : "Inactivo"}
                        </span>
                      </span>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-2 pt-3 border-t">
                      <div className="flex items-start text-xs">
                        <Icon
                          icon="mdi:email"
                          className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700 truncate">
                          {funcionario.email}
                        </span>
                      </div>
                      <div className="flex items-start text-xs">
                        <Icon
                          icon="mdi:phone"
                          className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700">
                          {funcionario.telefono}
                        </span>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Creación</p>
                        <p className="text-xs font-medium text-gray-900">
                          {formatDate(funcionario.fechaCreacion)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Actualización
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {formatDate(funcionario.fechaActualizado)}
                        </p>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2 pt-3 border-t">
                      <button
                        onClick={() => abrirModalEditar(funcionario)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => abrirModalEliminar(funcionario)}
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
                    {modalMode === "crear"
                      ? "Nuevo Funcionario"
                      : "Editar Funcionario"}
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
                    modalMode === "crear"
                      ? crearFuncionario
                      : actualizarFuncionario
                  }
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="nombreCompleto"
                          value={formData.nombreCompleto}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Ej: Juan Carlos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Apellido Completo *
                        </label>
                        <input
                          type="text"
                          name="apellidoCompleto"
                          value={formData.apellidoCompleto}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Ej: Pérez García"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Cargo *
                      </label>
                      <input
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Ej: Jefe de oficina"
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
                          placeholder="555-0123"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
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
                        Funcionario activo
                      </label>
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
                            {modalMode === "crear" ? "Crear" : "Guardar"}
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
        {showDeleteModal && selectedFuncionario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="w-6 h-6 text-red-600"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar funcionario?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                ¿Está seguro de eliminar a{" "}
                <strong className="text-gray-900">
                  {selectedFuncionario.nombreCompleto}{" "}
                  {selectedFuncionario.apellidoCompleto}
                </strong>
                ?
              </p>
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarFuncionario}
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

export default Funcionarios;
