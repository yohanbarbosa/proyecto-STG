import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
const GovernmentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Datos de ejemplo
  const stats = {
    totalTramites: 1247,
    pendientes: 342,
    procesando: 156,
    completados: 749,
  };

  const tramitesData = [
    { mes: "Ene", tramites: 85 },
    { mes: "Feb", tramites: 92 },
    { mes: "Mar", tramites: 78 },
    { mes: "Apr", tramites: 105 },
    { mes: "May", tramites: 120 },
    { mes: "Jun", tramites: 98 },
  ];

  const tiposTramites = [
    { tipo: "Licencias", cantidad: 45, color: "#3b82f6" },
    { tipo: "Permisos", cantidad: 32, color: "#10b981" },
    { tipo: "Certificados", cantidad: 28, color: "#f59e0b" },
    { tipo: "Registros", cantidad: 21, color: "#ef4444" },
  ];

  const tramitesList = [
    {
      id: "001",
      tipo: "Licencia de Construcción",
      solicitante: "María González",
      fecha: "2024-09-20",
      estado: "pendiente",
      departamento: "Urbanismo",
    },
    {
      id: "002",
      tipo: "Permiso de Funcionamiento",
      solicitante: "Juan Pérez",
      fecha: "2024-09-19",
      estado: "procesando",
      departamento: "Comercio",
    },
    {
      id: "003",
      tipo: "Certificado de Residencia",
      solicitante: "Ana Rodríguez",
      fecha: "2024-09-18",
      estado: "completado",
      departamento: "Registro Civil",
    },
    {
      id: "004",
      tipo: "Registro Mercantil",
      solicitante: "Carlos López",
      fecha: "2024-09-17",
      estado: "rechazado",
      departamento: "Registro",
    },
    {
      id: "005",
      tipo: "Licencia Ambiental",
      solicitante: "Laura Martín",
      fecha: "2024-09-16",
      estado: "procesando",
      departamento: "Medio Ambiente",
    },
  ];

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
        return <Icon icon="mdi:clock-outline" className="w-4 h-4" />;
      case "procesando":
        return <Icon icon="mdi:alert-outline" className="w-4 h-4" />;
      case "completado":
        return <Icon icon="mdi:check-circle-outline" className="w-4 h-4" />;
      case "rechazado":
        return <Icon icon="mdi:close-circle-outline" className="w-4 h-4" />;
      default:
        return <Icon icon="material-symbols:description" className="w-4 h-4" />;
    }
  };

  const filteredTramites =
    selectedStatus === "todos"
      ? tramitesList
      : tramitesList.filter((tramite) => tramite.estado === selectedStatus);

  return (
    <div className="">
      {/* Header */}
      <Topbar />

      <div className="flex w-full ">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 w-[80%] ">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Panel Principal
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Icon icon="mdi:calendar" className="w-4 h-4" />
                  <span>
                    Última actualización: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Trámites
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalTramites}
                      </p>
                    </div>
                    <Icon
                      icon="material-symbols:description"
                      className="w-8 h-8 text-blue-600"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pendientes
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {stats.pendientes}
                      </p>
                    </div>
                    <Icon
                      icon="mdi:clock-outline"
                      className="w-8 h-8 text-yellow-600"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Procesando
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.procesando}
                      </p>
                    </div>
                    <Icon
                      icon="mdi:alert-outline"
                      className="w-8 h-8 text-blue-600"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completados
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.completados}
                      </p>
                    </div>
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="w-8 h-8 text-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Trámites por Mes
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tramitesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="tramites"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tipos de Trámites
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tiposTramites}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="cantidad"
                        label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                      >
                        {tiposTramites.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tramites" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestión de Trámites
                </h2>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Icon
                        icon="material-symbols:search"
                        className="w-4 h-4 absolute left-3 top-3 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Buscar trámites..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="procesando">Procesando</option>
                      <option value="completado">Completados</option>
                      <option value="rechazado">Rechazados</option>
                    </select>
                  </div>
                  <Icon
                    icon="mdi:filter-outline"
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
              </div>

              {/* Tramites Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Trámite
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Solicitante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Departamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTramites.map((tramite) => (
                        <tr key={tramite.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{tramite.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tramite.tipo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tramite.solicitante}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tramite.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                tramite.estado
                              )}`}
                            >
                              {getStatusIcon(tramite.estado)}
                              <span className="capitalize">
                                {tramite.estado}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tramite.departamento}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Icon
                                  icon="mdi:eye-outline"
                                  className="w-4 h-4"
                                />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Icon
                                  icon="mdi:pencil-outline"
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reportes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reportes y Estadísticas
                </h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
                  <Icon icon="material-symbols:download" className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Productividad por Departamento
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={[
                      {
                        departamento: "Urbanismo",
                        completados: 45,
                        pendientes: 12,
                      },
                      {
                        departamento: "Comercio",
                        completados: 38,
                        pendientes: 8,
                      },
                      {
                        departamento: "Registro Civil",
                        completados: 52,
                        pendientes: 15,
                      },
                      {
                        departamento: "Medio Ambiente",
                        completados: 28,
                        pendientes: 7,
                      },
                      {
                        departamento: "Hacienda",
                        completados: 41,
                        pendientes: 11,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="departamento" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="completados"
                      fill="#10b981"
                      name="Completados"
                    />
                    <Bar
                      dataKey="pendientes"
                      fill="#f59e0b"
                      name="Pendientes"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="mdi:map-marker-outline"
                      className="w-8 h-8 text-blue-600"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Tiempo Promedio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        7.2 días
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="mdi:phone-outline"
                      className="w-8 h-8 text-green-600"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Satisfacción</p>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="mdi:email-outline"
                      className="w-8 h-8 text-purple-600"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Eficiencia</p>
                      <p className="text-2xl font-bold text-gray-900">87%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
