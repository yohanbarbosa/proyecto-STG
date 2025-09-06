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
                            <th class="py-2 px-4 border border-gray-300">Descripcion</th>
                            <th class="py-2 px-4 border border-gray-300">Encabezado 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"><Link to="/useState" className="border-cyan-900 border p-2 inline-block mr-2">
                                ir a useState
                            </Link></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 2</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 3</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"><Link to="/useNavigate" className="border-cyan-900 border p-2 inline-block">
                                ir a useNavigate
                            </Link></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                        <tr class="">
                            <td class="py-2 px-4 border border-gray-300"></td>
                            <td class="py-2 px-4 border border-gray-300">Dato 5</td>
                            <td class="py-2 px-4 border border-gray-300">Dato 6</td>
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    );

}

export default HomeHooks;