import { Icon } from "@iconify/react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Topbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b w-full ">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon
              icon="mdi:office-building"
              className="w-8 h-8 text-blue-600"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Trámites
              </h1>
              <p className="text-sm text-gray-600">Gobierno Municipal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className=" select-none flex items-center space-x-2 text-gray-600">
              <Icon icon="mdi:account" className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>
            <div className="">
              <button onClick={handleLogout} className="rounded-sm  p-2  hover:bg-red-600 cursor-pointer">
                <Icon icon="mdi:logout" width="26" height="26" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
