import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "../../context/AuthProvider";
import Swal from "sweetalert2";

const NuevoTramite = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    tipoId: "",
    tipo: "",
    departamento: "",
    descripcion: "",
    solicitante: user?.displayName || "",
    documento: "",
    telefono: "",
    email: user?.email || "",
    fechaLimite: "",
  });

  const [duracionEstimada, setDuracionEstimada] = useState(null);

  const tiposTramite = [
    {
      id: "licencia_construccion",
      nombre: "Licencia de Construcción",
      departamento: "Planeación / Obras Públicas",
      duracionDias: 15,
    },
    {
      id: "permiso_funcionamiento",
      nombre: "Permiso de Funcionamiento",
      departamento: "Salud",
      duracionDias: 20,
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
      duracionDias: 7,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTipoChange = (e) => {
    const tipoSeleccionado = tiposTramite.find((t) => t.id === e.target.value);

    if (!tipoSeleccionado) return;

    // Fecha actual
    const hoy = new Date();

    // Fecha límite automática
    const fechaLimite = new Date(hoy);
    fechaLimite.setDate(hoy.getDate() + tipoSeleccionado.duracionDias);

    setFormData((prev) => ({
      ...prev,
      tipoId: tipoSeleccionado.id,
      tipo: tipoSeleccionado.nombre,
      departamento: tipoSeleccionado.departamento,
      fechaLimite: fechaLimite, // ← Date, no string
    }));

    setDuracionEstimada(tipoSeleccionado.duracionDias);

    setErrors((prev) => ({
      ...prev,
      tipoId: "",
      departamento: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar tipo de trámite
    if (!formData.tipoId) {
      newErrors.tipoId = "Debe seleccionar un tipo de trámite";
    }

    // Validar departamento (se asigna automáticamente, pero verificamos)
    if (!formData.departamento) {
      newErrors.departamento = "El departamento no se asignó correctamente";
    }

    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion =
        "La descripción debe tener al menos 10 caracteres";
    } else if (formData.descripcion.trim().length > 500) {
      newErrors.descripcion = "La descripción no puede exceder 500 caracteres";
    }

    // Validar solicitante
    if (!formData.solicitante.trim()) {
      newErrors.solicitante = "El nombre del solicitante es obligatorio";
    } else if (formData.solicitante.trim().length < 3) {
      newErrors.solicitante = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar documento
    if (!formData.documento.trim()) {
      newErrors.documento = "El documento es obligatorio";
    } else if (!/^\d{10}$/.test(formData.documento.replace(/\s/g, ""))) {
      newErrors.documento = "El documento debe tener exactamente 10 dígitos";
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ""))) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor completa todos los campos correctamente",
      });
      return;
    }

    setLoading(true);

    try {
      // Convertir la fecha límite a Timestamp de Firebase
      const fechaLimiteDate = new Date(formData.fechaLimite);
      const fechaLimiteTimestamp = Timestamp.fromDate(fechaLimiteDate);

      // Crear el documento en Firestore
      const tramiteData = {
        tipo: formData.tipo,
        departamento: formData.departamento,
        descripcion: formData.descripcion.trim(),
        solicitante: formData.solicitante.trim(),
        documento: formData.documento.replace(/\s/g, ""),
        telefono: formData.telefono.replace(/\s/g, ""),
        email: formData.email.trim().toLowerCase(),
        fechaLimite: fechaLimiteTimestamp,
        duracionEstimadaDias: duracionEstimada,
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
      Swal.fire({
        icon: "success",
        title: "¡Trámite creado!",
        text: "Tu trámite ha sido registrado exitosamente",
        confirmButtonText: "Aceptar",
      }).then(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      });
    } catch (error) {
      console.error("Error al crear trámite:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el trámite. Por favor intenta nuevamente.",
      });
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
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6 pb-24 sm:pb-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Tipo de Trámite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tipo de Trámite <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipoId"
                  value={formData.tipoId}
                  onChange={handleTipoChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                    errors.tipoId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Seleccione un tipo de trámite</option>
                  {tiposTramite.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {errors.tipoId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                    {errors.tipoId}
                  </p>
                )}
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.departamento}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    placeholder="Se asigna automáticamente"
                  />
                  {formData.departamento && (
                    <Icon
                      icon="mdi:check-circle"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500"
                    />
                  )}
                </div>
                {errors.departamento && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                    {errors.departamento}
                  </p>
                )}
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
                  placeholder="Describa los detalles de su trámite... (mínimo 10 caracteres)"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none text-sm sm:text-base transition ${
                    errors.descripcion
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {errors.descripcion && (
                      <p className="text-red-500 text-xs flex items-center">
                        <Icon
                          icon="mdi:alert-circle"
                          className="w-4 h-4 mr-1"
                        />
                        {errors.descripcion}
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      formData.descripcion.length > 450
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.descripcion.length}/500
                  </p>
                </div>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base transition ${
                      errors.solicitante
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.solicitante && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                      {errors.solicitante}
                    </p>
                  )}
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="1234567890"
                    maxLength={10}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base transition ${
                      errors.documento
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.documento && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                      {errors.documento}
                    </p>
                  )}
                </div>
              </div>

              {/* Grid para teléfono y email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Grid para teléfono y email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      maxLength={10}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base transition ${
                        errors.telefono
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <Icon
                          icon="mdi:alert-circle"
                          className="w-4 h-4 mr-1"
                        />
                        {errors.telefono}
                      </p>
                    )}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base transition ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <Icon
                          icon="mdi:alert-circle"
                          className="w-4 h-4 mr-1"
                        />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fecha Límite con información de duración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Fecha Límite (calculada automáticamente)
                  </label>

                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm">
                    {formData.fechaLimite
                      ? formData.fechaLimite.toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Seleccione un tipo de trámite"}
                  </div>

                  {duracionEstimada && (
                    <p className="text-xs text-amber-700 mt-2 flex items-center">
                      <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-1" />
                      Duración estimada: {duracionEstimada} días
                    </p>
                  )}
                </div>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start space-x-2">
                    <Icon
                      icon="mdi:information"
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-xs sm:text-sm text-blue-800">
                      <p className="font-medium mb-1">
                        Información importante:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>
                          Su trámite será procesado en un plazo de 5 a 15 días
                          hábiles
                        </li>
                        <li>Recibirá notificaciones por correo electrónico</li>
                        <li>
                          Puede hacer seguimiento desde su panel de control
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones - Fixed en móvil */}
          <div className="fixed sm:relative bottom-0 left-0 right-0 bg-white border-t p-4 sm:px-6 sm:pb-6 flex flex-col-reverse sm:flex-row gap-3 shadow-lg sm:shadow-none">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
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
        </form>
      </div>
    </div>
  );
};

export default NuevoTramite;
