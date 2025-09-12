import React from "react";
import { Link } from "react-router-dom";
function HomeHooks() {
  return (
    <div className="flex justify-center">
      <div className="text-center">
        <table class="shadow-md  min-w-full border border-gray-300 rounded-md overflow-hidden">
          <caption className="py-4 bg-blue-600">
            Ejemplos de hook en react 19
          </caption>
          <thead className="">
            <tr>
              <th class="bg-gray-200 py-2 px-4 border border-gray-300 w-[250px]">Enlace</th>
              <th class="bg-gray-200 py-2 px-4 border border-gray-300">Hook</th>
              <th class="bg-gray-200 py-2 px-4 border border-gray-300 w-[500px]">
                Descripción
              </th>
              <th class="bg-gray-200 py-2 px-4 border border-gray-300">Categoría</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useActionState"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useActionState
              </td>
              <td className="py-2 px-4 border border-gray-300">
                sirve para manejar el estado de una acción asíncrona, por
                ejemplo cuando se envia un formulario o cuando se ejecuta algo
                que tarda.
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Nuevos en React 19
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useCallbak"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useCallback</td>
              <td className="py-2 px-4 border border-gray-300">
                Es igual que useNemo pero para funciones, lo que hace es
                devolver una funcion memorizada que no se crea en cada render{" "}
              </td>
              <td className="py-2 px-4 border border-gray-300">Performance</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useContext"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useContext</td>
              <td className="py-2 px-4 border border-gray-300">
                permite compartir información entre componentes sin tener que
                pasar un props manualmente.
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Contexto y datos externos
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useDebugValue"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useDebugValue
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Solo se usa dentro de custom hooks. Permite mostrar información
                extra en React DevTools para facilitar el debugging
              </td>
              <td className="py-2 px-4 border border-gray-300">Debug</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useDeferredValue"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useDeferredValue
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Hace que se retrase el valor de una variable hasta que react se
                libere para poder actualizarla
              </td>
              <td className="py-2 px-4 border border-gray-300">Performance</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useEffect"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useEffect</td>
              <td className="py-2 px-4 border border-gray-300">
                Permite ejecutar efectos secundarios en los componentes, un
                efecto secundario es cualquier accion que se realiza fuera del
                flujo normal del renderizado. por ejemplo el llamado de una api
                o manejo de eventos{" "}
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Efectos / ciclo de vida
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useId"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useId</td>
              <td className="py-2 px-4 border border-gray-300">
                sirve para generar identificadores únicos y estables en el
                renderizado del componente.{" "}
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Identificadores
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useImperativeHandle"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useImperativeHandle
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Se usa para controlar que valores o metodos puede mostrar un
                componente hijo a su padre
              </td>
              <td className="py-2 px-4 border border-gray-300">Referencias</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useInsertionEffect"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useInsertionEffect
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Se usa para insertar estilos de forma dinamica{" "}
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Efectos / ciclo de vida
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useMemo"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useMemo</td>
              <td className="py-2 px-4 border border-gray-300">
                Memoriza un valor calculado y lo vuelve a calcular solo cuando
                cambian sus dependencias, lo que ayuda a mejorar el rendimiento
              </td>
              <td className="py-2 px-4 border border-gray-300">Performance</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useOptimistic"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useOptimistic
              </td>
              <td className="py-2 px-4 border border-gray-300">
                permite manejar actualizaciones optimistas en la interfaz, Una
                actualización optimista es cuando actualizamos la interfaz de
                usuario de inmediato como si la acción ya hubiera tenido éxito,
                sin esperar la respuesta del servidor.
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Nuevos en React 19
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useReducer"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useReducer</td>
              <td className="py-2 px-4 border border-gray-300">
                sirve para manejar estados más complejos o cuando varias
                acciones afectan al mismo estado.
              </td>
              <td className="py-2 px-4 border border-gray-300">Estado</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useRef"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useRef</td>
              <td className="py-2 px-4 border border-gray-300">
                Es como una cajita donde se pueden guardar valores, donde el
                valor que se guarda no cambia entre renders{" "}
              </td>
              <td className="py-2 px-4 border border-gray-300">Referencias</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useState"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useState</td>
              <td className="py-2 px-4 border border-gray-300">
                Maneja el estado dentro de un componente funcional.
              </td>
              <td className="py-2 px-4 border border-gray-300">Estado</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useNavigate"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">useNavigate</td>
              <td className="py-2 px-4 border border-gray-300">
                Permite navegar entre rutas en React Router.
              </td>
              <td className="py-2 px-4 border border-gray-300">Navegación</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useLayoutEffect"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useLayoutEffect
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Es igual al useEffect con la diferencia de que este se ejecuta
                despues del renderizado de la pagina y antes de que el navegador
                pinte la pagina en la pantalla
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Efectos / ciclo de vida
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useSyncExternalStore"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useSyncExternalStore
              </td>
              <td className="py-2 px-4 border border-gray-300">
                sirve para leer datos externos de un store, lo que hace que los
                renders siempre estén sincronizados con el estado global
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Estado externo
              </td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-2 px-4 border border-gray-300">
                <Link
                  className="justify-center flex border-[1px] border-gray-500 py-[5px] px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  to="/useTransition"
                >
                  Ir a ejemplo
                </Link>
              </td>
              <td className="py-2 px-4 border border-gray-300">
                useTransition
              </td>
              <td className="py-2 px-4 border border-gray-300">
                Ayuda a separar lo rapido de lo pesado, para que la pagina no se
                congele por ejemplo que la escritura en un input sea fluida
                mientras que la carga de la lista sea lenta{" "}
              </td>
              <td className="py-2 px-4 border border-gray-300">Performance</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeHooks;
