import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Icon } from "@iconify/react";

function ExportPdf({ data, fileName }) {
  const [loading, setLoading] = useState(false);

  const toDate = (timestamp) => {
    if (!timestamp?.seconds) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    setLoading(true);

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "A4",
      });

      // Fecha de generación
      const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      let titulo = "";
      let head = [];
      let body = [];

      // USUARIOS
      if (fileName === "usuarios" || fileName === "usuarios_filtrados") {
        titulo = fileName.includes("filtrados")
          ? "Reporte de Usuarios (Filtrado)"
          : "Reporte de Usuarios";

        // Encabezado
        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(titulo, 40, 40);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Fecha de generación: ${fechaGeneracion}`, 40, 60);
        doc.text(`Total de registros: ${data.length}`, 40, 75);

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
      // SESIONES
      else if (fileName === "sesiones" || fileName === "sesiones_filtradas") {
        titulo = fileName.includes("filtradas")
          ? "Reporte de Sesiones (Filtrado)"
          : "Reporte de Sesiones";

        // Encabezado
        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(titulo, 40, 40);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Fecha de generación: ${fechaGeneracion}`, 40, 60);
        doc.text(`Total de registros: ${data.length}`, 40, 75);

        head = [
          ["Nombre", "Correo", "Entrada", "Salida", "Duración", "Proveedor"],
        ];

        body = data.map((s) => [
          s.displayName || "Sin nombre",
          s.email,
          toDate(s.loginTime),
          toDate(s.logoutTime),
          s.duration ? `${s.duration}s` : "N/A",
          s.provider || "",
        ]);
      } else if (
        fileName === "funcionarios" ||
        fileName === "funcionarios_filtrados"
      ) {
        titulo = fileName.includes("filtrados")
          ? "Reporte de Funcionarios (Filtrado)"
          : "Reporte de Funcionarios";

        // Encabezado
        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(titulo, 40, 40);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Fecha de generación: ${fechaGeneracion}`, 40, 60);
        doc.text(`Total de registros: ${data.length}`, 40, 75);

        head = [
          [
            "Nombre Completo",
            "Email",
            "Teléfono",
            "Cargo",
            "Estado",
            "Fecha Creación",
          ],
        ];

        body = data.map((f) => [
          `${f.nombreCompleto || ""} ${f.apellidoCompleto || ""}`.trim(),
          f.email || "",
          f.telefono || "",
          f.cargo || "",
          f.estado ? "Activo" : "Inactivo",
          toDate(f.fechaCreacion),
        ]);
      } else if (fileName === "tipo_tramites") {
        titulo = "Reporte de Tipos de Trámite";

        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(titulo, 40, 40);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Fecha de generación: ${fechaGeneracion}`, 40, 60);
        doc.text(`Total de registros: ${data.length}`, 40, 75);

        head = [["Nombre", "Estado", "Fecha Creación", "Última Actualización"]];

        body = data.map((t) => [
          t.nombre || "",
          t.estado ? "Activo" : "Inactivo",
          t.fechaCreacion || "",
          t.ultimaActualizacion || "",
        ]);
      } else if (fileName === "tramites" || fileName === "tramites_filtrados") {
        titulo = fileName.includes("filtrados")
          ? "Reporte de Trámites (Filtrado)"
          : "Reporte de Trámites";

        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(titulo, 40, 40);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Fecha de generación: ${fechaGeneracion}`, 40, 60);
        doc.text(`Total de registros: ${data.length}`, 40, 75);

        head = [
          [
            "Solicitante",
            "Tipo",
            "Departamento",
            "Email",
            "Teléfono",
            "Estado",
            "Fecha Creación",
            "Fecha Actualización",
          ],
        ];

        body = data.map((t) => [
          t.solicitante || "",
          t.tipo || "",
          t.departamento || "",
          t.email || "",
          t.telefono || "",
          t.estado ? t.estado.charAt(0).toUpperCase() + t.estado.slice(1) : "",
          t.fechaCreado
            ? new Date(t.fechaCreado).toLocaleString("es-CO")
            : "N/A",
          t.fechaActualizado
            ? new Date(t.fechaActualizado).toLocaleString("es-CO")
            : "N/A",
        ]);
      }

      // Generar tabla
      autoTable(doc, {
        startY: 90,
        head: head,
        body: body,
        styles: {
          fontSize: 8,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [37, 99, 235], // Azul
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        margin: { top: 90, left: 40, right: 40 },
      });

      // Guardar archivo
      doc.save(
        `${fileName}_${new Date()
          .toLocaleDateString("es-ES")
          .replace(/\//g, "-")}.pdf`
      );
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al generar el archivo PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon icon="mdi:file-pdf-box" className="w-5 h-5 text-white" />
      <span className="hidden sm:inline">
        {loading ? "Descargando..." : "PDF"}
      </span>
    </button>
  );
}

export default ExportPdf;
