import React from "react";
import { Link } from 'react-router-dom';
function HomeHooks() {
    return (
        <div className="flex justify-center h-[100px]">

            <div className="text-center">
                <h2 className="mb-10 bg-gray-500 rounded-2xl" >ejemplos de hook en react 19</h2>
               

                <table class="min-w-full border border-gray-300 rounded-md overflow-hidden">
  <thead class="bg-cyan-900 text-white">
    <tr>
      <th class="py-2 px-4 border border-gray-300">Enlace</th>
      <th class="py-2 px-4 border border-gray-300">Hook</th>
      <th class="py-2 px-4 border border-gray-300">Descripción</th>
      <th class="py-2 px-4 border border-gray-300">Categoría</th>
    </tr>
  </thead>
  <tbody>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <Link to="/useState" >ir a UseState</Link>
      </td>
      <td class="py-2 px-4 border border-gray-300">useState</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Estado</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
       <Link to="/useEffect" >ir a UseEffect</Link>
      </td>
      <td class="py-2 px-4 border border-gray-300">useEffect</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Efectos</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
       <Link to="/useContext" >ir a UseContext</Link>
      </td>
      <td class="py-2 px-4 border border-gray-300">useContext</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Contexto</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#usereducer" target="_blank" class="text-cyan-700 hover:underline">useReducer</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useReducer</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Estado</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <Link to="/useRef" >ir a UseRef</Link>
      </td>
      <td class="py-2 px-4 border border-gray-300">useRef</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Referencias</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#usecallback" target="_blank" class="text-cyan-700 hover:underline">useCallback</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useCallback</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Optimización</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <Link to="/useMemo" >ir a Memo</Link>
      </td>
      <td class="py-2 px-4 border border-gray-300">useMemo</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Optimización</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#useimperativehandle" target="_blank" class="text-cyan-700 hover:underline">useImperativeHandle</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useImperativeHandle</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Referencias</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#uselayouteffect" target="_blank" class="text-cyan-700 hover:underline">useLayoutEffect</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useLayoutEffect</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Efectos</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#usedebugvalue" target="_blank" class="text-cyan-700 hover:underline">useDebugValue</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useDebugValue</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Debug</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#usetransition" target="_blank" class="text-cyan-700 hover:underline">useTransition</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useTransition</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Concurrent / UI</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#usedeferredvalue" target="_blank" class="text-cyan-700 hover:underline">useDeferredValue</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useDeferredValue</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Concurrent / UI</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#useid" target="_blank" class="text-cyan-700 hover:underline">useId</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useId</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">IDs únicos</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore" target="_blank" class="text-cyan-700 hover:underline">useSyncExternalStore</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useSyncExternalStore</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Suscripción externa</td>
    </tr>
    <tr class="even:bg-gray-100">
      <td class="py-2 px-4 border border-gray-300">
        <a href="https://reactjs.org/docs/hooks-reference.html#useinsertioneffect" target="_blank" class="text-cyan-700 hover:underline">useInsertionEffect</a>
      </td>
      <td class="py-2 px-4 border border-gray-300">useInsertionEffect</td>
      <td class="py-2 px-4 border border-gray-300"></td>
      <td class="py-2 px-4 border border-gray-300">Efectos</td>
    </tr>
  </tbody>
</table>


            </div>
        </div>
    );

}

export default HomeHooks;