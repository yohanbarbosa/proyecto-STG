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

    let columnWidths = [];
    let rows = [];
    if (fileName === "usuarios") {
      columnWidths = [40, 50, 40, 40, 60];
      rows = data.map((item) => ({
        Nombre: item.displayName || "Sin nombre",
        Correo: item.email || "",
        "Último Login": toDate(item.lastLogin),
        "Última Salida": toDate(item.lastLogout),
        Proveedores: item.providers?.join(", ") || "",
      }));
    } else if (fileName === "sesiones") {
      columnWidths.length = 0;
      columnWidths = [40, 50, 20, 20, 10, 30];
      rows = data.map((item) => ({
        Nombre: item.displayName || "Sin nombre",
        Correo: item.email || "",
        "Hora de entrada": toDate(item.loginTime),
        "Hora de salida": toDate(item.logoutTime),
        Duración: item.duration ?? "N/A",
        Proveedor: item.provider || "",
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = columnWidths.map((w) => ({ wch: w }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${fileName}.xlsx`);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    setLoading(false);
  };
  return (
    <button
    onClick={handleDownload}
    disabled={loading}
    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm cursor-pointer"
  >
    <Icon icon="mdi:file-excel" width="24" height="24" />
    <span className="hidden sm:inline">{loading ? "Descargando..." : "Export Excel"}</span>

  </button>
  );
}

export default ExportExcel;

