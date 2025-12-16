import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "../../context/AuthProvider";

const NuevoTramite = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    departamento: "",
    descripcion: "",
    solicitante: user?.displayName || "",
    telefono: "",
    email: user?.email || "",
    fechaLimite: "",
  });

  const tiposTramite = [
    {
      id: "licencia_construccion",
      nombre: "Licencia de Construcción",
      departamento: "Planeación / Obras Públicas",
      duracionDias: 45,
    },
    {
      id: "permiso_funcionamiento",
      nombre: "Permiso de Funcionamiento",
      departamento: "Salud",
      duracionDias: 30,
    },
    {
      id: "registro_civil",
      nombre: "Registro Civil",
      departamento: "Registro Civil",
      duracionDias: 15,
    },
    {
      id: "pasaporte",
      nombre: "Pasaporte",
      departamento: "Gobierno / Secretaría General",
      duracionDias: 20,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear el documento en Firestore
      const tramiteData = {
        tipo: formData.tipo,
        departamento: formData.departamento,
        descripcion: formData.descripcion,
        solicitante: formData.solicitante,
        telefono: formData.telefono,
        email: formData.email,
        fechaLimite: formData.fechaLimite,
        estadoActual: "Solicitud Recibida",
        estado: "procesando",
        etapaActual: 1,
        userId: user.uid,
        solicitantId: user.uid,
        fechaCreado: serverTimestamp(),
        fechaActualizado: serverTimestamp(),
      };

      await addDoc(collection(db, "Tramites"), tramiteData);

      // Notificar éxito
      if (onSuccess) onSuccess();

      // Cerrar modal
      if (onClose) onClose();

      alert("Trámite creado exitosamente");
    } catch (error) {
      console.error("Error al crear trámite:", error);
      alert("Error al crear el trámite. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white pt-16 rounded-none sm:rounded-lg shadow-xl w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon
                icon="mdi:file-document-plus"
                className="w-6 h-6 text-blue-600"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Nuevo Trámite
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Complete la información del trámite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            {/* Tipo de Trámite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo de Trámite <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoId"
                value={formData.tipoId}
                onChange={(e) => {
                  const tipoSeleccionado = tiposTramite.find(
                    (t) => t.id === e.target.value
                  );

                  setFormData({
                    ...formData,
                    tipoId: tipoSeleccionado.id,
                    tipo: tipoSeleccionado.nombre,
                    departamento: tipoSeleccionado.departamento,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccione un tipo de trámite</option>
                {tiposTramite.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Departamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Departamento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.departamento}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                placeholder="Se asigna automáticamente"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                placeholder="Describa los detalles de su trámite..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
            </div>

            {/* Grid para campos en dos columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Solicitante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Solicitante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="solicitante"
                  value={formData.solicitante}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="3001234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Fecha Límite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fecha Límite <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Fecha en que necesita el trámite completado
              </p>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2">
                <Icon
                  icon="mdi:information"
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div className="text-xs sm:text-sm text-blue-800">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>
                      Su trámite será procesado en un plazo de 5 a 15 días
                      hábiles
                    </li>
                    <li>Recibirá notificaciones por correo electrónico</li>
                    <li>Puede hacer seguimiento desde su panel de control</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="fixed sm:relative bottom-0 left-0 right-0 bg-white border-t sm:border-t-0 p-4 sm:p-6 sm:pt-6 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-5 h-5" />
                  <span>Crear Trámite</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoTramite;
