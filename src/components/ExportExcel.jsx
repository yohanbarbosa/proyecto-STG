import { useState } from "react";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";

function ExportExcel({ data, fileName }) {
  const [loading, setLoading] = useState(false);

  const toDate = (timestamp) => {
    if (!timestamp?.seconds) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleString("es-ES");
  };

  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    setLoading(true);

    try {
      let columnWidths = [];
      let rows = [];
      let sheetName = "";

      // USUARIOS
      if (fileName === "usuarios" || fileName === "usuarios_filtrados") {
        sheetName = "Usuarios";
        columnWidths = [40, 50, 40, 40, 60];
        rows = data.map((item) => ({
          Nombre: item.displayName || "Sin nombre",
          Correo: item.email || "",
          "Último Login": toDate(item.lastLogin),
          "Última Salida": toDate(item.lastLogout),
          Proveedores: item.providers?.join(", ") || "",
        }));
      }
      // SESIONES
      else if (fileName === "sesiones" || fileName === "sesiones_filtradas") {
        sheetName = "Sesiones";
        columnWidths = [40, 50, 30, 30, 15, 30];
        rows = data.map((item) => ({
          Nombre: item.displayName || "Sin nombre",
          Correo: item.email || "",
          "Hora de entrada": toDate(item.loginTime),
          "Hora de salida": toDate(item.logoutTime),
          "Duración (seg)": item.duration ?? "N/A",
          Proveedor: item.provider || "",
        }));
      }
      // FUNCIONARIOS
      else if (
        fileName === "funcionarios" ||
        fileName === "funcionarios_filtrados"
      ) {
        sheetName = "Funcionarios";
        columnWidths = [40, 40, 50, 30, 40, 15, 25, 25];
        rows = data.map((item) => ({
          Nombre: item.nombreCompleto || "",
          Apellido: item.apellidoCompleto || "",
          Email: item.email || "",
          Teléfono: item.telefono || "",
          Cargo: item.cargo || "",
          Estado: item.estado ? "Activo" : "Inactivo",
          "Fecha Creación": toDate(item.fechaCreacion),
          "Fecha Actualización": toDate(item.fechaActualizado),
        }));
      } else if (fileName === "tipo_tramites") {
        sheetName = "Tipo de Trámites";
        columnWidths = [40, 20, 30, 30];

        rows = data.map((item) => ({
          Nombre: item.nombre || "",
          Estado: item.estado ? "Activo" : "Inactivo",
          "Fecha creación": item.fechaCreacion || "",
          "Última actualización": item.ultimaActualizacion || "",
        }));
      } else if (fileName === "tramites") {
        sheetName = "Trámites";
        columnWidths = [30, 30, 30, 40, 25, 20, 25, 25];

        rows = data.map((item) => ({
          Solicitante: item.solicitante || "",
          "Tipo de Trámite": item.tipo || "",
          Departamento: item.departamento || "",
          Email: item.email || "",
          Teléfono: item.telefono || "",
          Estado: item.estado
            ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1)
            : "",
          "Fecha Creación": item.fechaCreado
            ? new Date(item.fechaCreado).toLocaleString("es-ES")
            : "N/A",
          "Fecha Actualización": item.fechaActualizado
            ? new Date(item.fechaActualizado).toLocaleString("es-ES")
            : "N/A",
        }));
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = columnWidths.map((w) => ({ wch: w }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      XLSX.writeFile(
        workbook,
        `${fileName}_${new Date()
          .toLocaleDateString("es-ES")
          .replace(/\//g, "-")}.xlsx`
      );
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      alert("Error al generar el archivo Excel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon icon="mdi:file-excel" className="w-5 h-5" />
      <span className="hidden sm:inline">
        {loading ? "Descargando..." : "Excel"}
      </span>
    </button>
  );
}

export default ExportExcel;
