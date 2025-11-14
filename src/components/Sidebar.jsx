import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      path: "/dashboard",
      icon: "material-symbols:dashboard",
      label: "Panel Principal",
      matchPath: "/dashboard"
    },
    {
      path: "/sesiones",
      icon: "mdi:account-clock",
      label: "Trámites",
      matchPath: "/sesiones"
    },
    {
      path: "/tramites",
      icon: "mdi:file-document-multiple",
      label: "Trámites",
      matchPath: "/tramites"
    },
    {
      path: "/tipo-tramites",
      icon: "material-symbols:category",
      label: "Tipo de Trámites",
      matchPath: "/tipo-tramites"
    },
    {
      path: "/funcionarios",
      icon: "mdi:account-tie",
      label: "Funcionarios",
      matchPath: "/funcionarios"
    }
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-0
          h-screen w-64 bg-white shadow-lg md:shadow-sm border-r
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header del sidebar (solo móvil) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:office-building" className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">Menú</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Cerrar menú"
          >
            <Icon icon="mdi:close" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="p-4 md:p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg 
                transition-colors text-sm md:text-base
                ${
                  currentPath === item.matchPath
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;