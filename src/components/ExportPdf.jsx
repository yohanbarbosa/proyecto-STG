import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Icon } from "@iconify/react";

function ExportPdf({ data, fileName }) {
  const [loading, setLoading] = useState(false);

  const toDate = (timestamp) => {
    if (!timestamp?.seconds) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleString("es-CO");
  };

  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    setLoading(true);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "A4",
    });

    let head = [];
    let body = [];

    if (fileName === "usuarios") {
      doc.text("Reporte de Usuarios", 200, 30);

      head = [
        ["Nombre", "Correo", "Último Login", "Última Salida", "Proveedores"],
      ];

      body = data.map((u) => [
        u.displayName || "Sin nombre",
        u.email || "",
        toDate(u.lastLogin),
        toDate(u.lastLogout),
        u.providers ? u.providers.join(", ") : "",
      ]);
    }

    if (fileName === "sesiones") {
      doc.text("Reporte de Sesiones", 200, 30);

      head = [
        ["Nombre", "Correo", "Entrada", "Salida", "Duración", "Proveedor"],
      ];

      body = data.map((s) => [
        s.displayName || "Sin nombre",
        s.email,
        toDate(s.loginTime),
        toDate(s.logoutTime),
        s.duration ?? "N/A",
        s.provider || "",
      ]);
    }

    autoTable(doc, {
      startY: 50,
      head: head,
      body: body,
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [48, 48, 226],
        textColor: 255,
      },
    });

    doc.save(`${fileName}.pdf`);
    setLoading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
    >
      <Icon icon="mdi:file-pdf-box" className="w-5 h-5 text-white" />
      <span className="hidden sm:inline">
        {loading ? "Descargando..." : "Exportar PDF"}
      </span>
    </button>
  );
}

export default ExportPdf;