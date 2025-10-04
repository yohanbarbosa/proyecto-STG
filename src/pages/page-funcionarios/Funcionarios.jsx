import { useEffect, useState } from "react";
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

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear"); // 'crear' o 'editar'
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    apellidoCompleto: "",
    email: "",
    telefono: "",
    cargo: "",
    estado: true,
  });

  // Traer los datos de funcionarios
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

  // CREAR FUNCIONARIO (CREATE)
  const crearFuncionario = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nuevoFuncionario = {
        ...formData,
        fechaCreacion: Timestamp.now(),
        fechaActualizado: Timestamp.now(),
      };
      const docRef = await addDoc(
        collection(db, "funcionarios"),
        nuevoFuncionario
      );
      console.log("Documento creado con ID: ", docRef.id);
      cerrarModal();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error al crear funcionario:", error);
      setLoading(false);
    }
  };

  // ACTUALIZAR FUNCIONARIO (UPDATE)
  const actualizarFuncionario = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const funcionarioRef = doc(db, "funcionarios", selectedFuncionario.id);
      const dataToUpdate = {
        ...formData,
        fechaActualizado: Timestamp.now(),
      };
      await updateDoc(funcionarioRef, dataToUpdate);
      cerrarModal();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar funcionario:", error);
      setLoading(false);
    }
  };

  // ELIMINAR FUNCIONARIO (DELETE)
  const eliminarFuncionario = async () => {
    setLoading(true);

    try {
      await deleteDoc(doc(db, "funcionarios", selectedFuncionario.id));
      setShowDeleteModal(false);
      setSelectedFuncionario(null);
      setLoading(false);
    } catch (error) {
      console.error("Error al eliminar funcionario:", error);
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
      <div>
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={abrirModalCrear}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            <span>Nuevo Funcionario</span>
          </button>
        </div>

        {!loading && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
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
                  {funcionarios.length === 0 ? (
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
                    funcionarios.map((funcionario) => (
                      <tr key={funcionario.id} className="hover:bg-gray-50">
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
                                {funcionario.nombreCompleto}{" "}
                                {funcionario.apellidoCompleto}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {funcionario.cargo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {funcionario.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {funcionario.telefono}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(funcionario.fechaCreacion)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(funcionario.fechaActualizado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => abrirModalEditar(funcionario)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Editar"
                            >
                              <Icon
                                icon="mdi:pencil-outline"
                                className="w-5 h-5"
                              />
                            </button>
                            <button
                              onClick={() => abrirModalEliminar(funcionario)}
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
                    {modalMode === "crear"
                      ? "Nuevo Funcionario"
                      : "Editar Funcionario"}
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
                      ? crearFuncionario
                      : actualizarFuncionario
                  }
                >
                  <div className="space-y-4">
                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="nombreCompleto"
                          value={formData.nombreCompleto}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Juan Carlos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido Completo *
                        </label>
                        <input
                          type="text"
                          name="apellidoCompleto"
                          value={formData.apellidoCompleto}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Pérez García"
                        />
                      </div>
                    </div>

                    {/* Cargo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo *
                      </label>
                      <input
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Jefe de oficina"
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
                        Funcionario activo
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
                              ? "Crear Funcionario"
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
        {showDeleteModal && selectedFuncionario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="w-6 h-6 text-red-600"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar funcionario?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Está seguro de que desea eliminar a{" "}
                <strong>
                  {selectedFuncionario.nombreCompleto}{" "}
                  {selectedFuncionario.apellidoCompleto}
                </strong>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarFuncionario}
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

export default Funcionarios;