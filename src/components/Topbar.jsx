import { Icon } from '@iconify/react';

function Topbar() {
    return(
        <header className="bg-white shadow-sm border-b w-full ">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Icon icon="mdi:office-building" className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Trámites</h1>
                <p className="text-sm text-gray-600">Gobierno Municipal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Icon icon="mdi:account" className="w-5 h-5" />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
}

export default Topbar;