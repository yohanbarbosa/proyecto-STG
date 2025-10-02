import Icon from "@mdi/react";
import { useState } from "react";
function Sidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  return (
    <aside className="border-r-[1px] w-64 bg-white shadow-sm h-screen sticky top-0">
      <nav className="p-6 space-y-2">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "dashboard"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="material-symbols:description" className="w-5 h-5" />
          <span>Panel Principal</span>
        </button>
        <button
          onClick={() => setActiveTab("tramites")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "tramites"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="mdi:account-group" className="w-5 h-5" />
          <span>Trámites</span>
        </button>
        <button
          onClick={() => setActiveTab("reportes")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "reportes"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon icon="material-symbols:download" className="w-5 h-5" />
          <span>Reportes</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
