import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import AppLayout from "../../components/AppLayout";
import { db } from "../../firebase";
import { Icon } from '@iconify/react';

function FuncionariosList() {
  const [funcionarios, setFuncionarios] = useState([]);

  //funcion flecha anonima usada para traer los datos 
  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "funcionarios"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFuncionarios(data);
      } catch (error) {
        console.error("Error al traer trámites:", error);
      }
    };

    fetchFuncionarios();
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'procesando': return 'bg-blue-100 text-blue-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente': return 'mdi:clock-outline';
      case 'procesando': return 'mdi:progress-clock';
      case 'completado': return 'mdi:check-circle-outline';
      case 'rechazado': return 'mdi:close-circle-outline';
      default: return 'mdi:file-document-outline';
    }
  };

  return (
    <AppLayout>
      <div>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creacion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Actualizacion
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo Electronico
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon
                          icon="mdi:account"
                          className="w-5 h-5 text-blue-600"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {funcionario.nombreCompleto}  {funcionario.apellidoCompleto}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {funcionario.cargo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {funcionario.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        funcionario.estado
                      )}`}
                    >
                      <Icon
                        icon={getStatusIcon(funcionario.estado)}
                        className="w-4 h-4"
                      />
                      <span className="">{funcionario.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {funcionario.fechaCreacion 
                     ? new Date(funcionario.fechaCreacion.seconds * 1000).toLocaleDateString("es-ES")
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.fechaActualizado 
                    ? new Date(funcionario.fechaActualizado.seconds * 1000).toLocaleDateString("es-ES")
                     : 'N/A'}
                  </td>
                   <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {funcionario.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => abrirModalEditar(funcionario)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Editar"
                      >
                        <Icon icon="mdi:pencil-outline" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => abrirModalEliminar(funcionario)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default FuncionariosList;
