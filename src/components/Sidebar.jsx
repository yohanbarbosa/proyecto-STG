import Icon from "@mdi/react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <aside className="border-r-[1px] w-64 bg-white shadow-sm h-screen sticky top-0">
      <nav className="p-6 space-y-2">
        <Link
          to="/"
        
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            currentPath  === "/"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="material-symbols:description" className="w-5 h-5" />
          <span>Panel Principal</span>
        </Link>
        <Link
          to="/tramites"
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            currentPath  === "/tramites"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="mdi:account-group" className="w-5 h-5" />
          <span>Trámites</span>
        </Link>
        <Link
          to="/tipo-tramites"
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            currentPath  === "/tipo-tramites"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="material-symbols:download" className="w-5 h-5" />
          <span>Tipo de Tramites</span>
        </Link>
        <Link
          to="/funcionarios"
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            currentPath  === "/funcionarios"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="material-symbols:download" className="w-5 h-5" />
          <span>Funcionarios</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
