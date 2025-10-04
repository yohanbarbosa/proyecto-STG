import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AppLayout from "../../components/AppLayout";
import { db } from "../../firebase";
import { Icon } from "@iconify/react";

function TipoTramites() {
  const [tipoTramites, setTipoTramites] = useState([]);

  // Traer los datos de tipo-tramites
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tipo-tramites"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTipoTramites(data);
      },
      (error) => {
        console.error("Error al escuchar tipos de trámites:", error);
      }
    );

    return () => unsubscribe();
  }, []);





  return (
    <AppLayout>
      <div>
        

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Trámite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actualización
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tipoTramites.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Icon
                          icon="mdi:file-document-multiple-outline"
                          className="w-12 h-12 mx-auto mb-2 text-gray-400"
                        />
                        <p>No se encontraron tipos de trámites</p>
                      </td>
                    </tr>
                  ) : (
                    tipoTramites.map((tipoTramite) => (
                      <tr key={tipoTramite.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Icon
                                icon="mdi:file-document-outline"
                                className="w-5 h-5 text-purple-600"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {tipoTramite.nombre}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tipoTramite.estado
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <Icon
                              icon={
                                tipoTramite.estado
                                  ? "mdi:check-circle-outline"
                                  : "mdi:close-circle-outline"
                              }
                              className="w-4 h-4"
                            />
                            <span>
                              {tipoTramite.estado ? "Activo" : "Inactivo"}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tipoTramite.fechaCreacion || "Sin fecha"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tipoTramite.ultimaActualizacion || "Sin fecha"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => abrirModalEditar(tipoTramite)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Editar"
                            >
                              <Icon
                                icon="mdi:pencil-outline"
                                className="w-5 h-5"
                              />
                            </button>
                            <button
                              onClick={() => abrirModalEliminar(tipoTramite)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Eliminar"
                            >
                              <Icon
                                icon="mdi:delete-outline"
                                className="w-5 h-5"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
     
      </div>
    </AppLayout>
  );
}

export default TipoTramites;