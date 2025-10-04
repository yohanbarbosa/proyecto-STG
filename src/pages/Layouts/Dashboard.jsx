import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AppLayout from "../../components/AppLayout";
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

function Dashboard() {
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

  return (
    <AppLayout>
      {/* <div className=" flex justify-center w-full bg-amber-300 h-screen">
       <div className="m-auto font-semibold text-5xl"> <h1>En mantenimiento</h1></div>
      </div> */}

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
    </AppLayout>
  );
}

export default Dashboard;
