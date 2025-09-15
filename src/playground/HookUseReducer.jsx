import React, { useReducer } from "react";
import { Link } from "react-router-dom";

function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

export default function CounterApp() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div className="flex items-center w-full h-screen">
      <div className="absolute top-5 left-5 ">
        <Link
          className=" hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
          to="/"
        >
          Volver al HomeHooks
        </Link>
      </div>
      <div className="w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ejemplo de HookUseReducer</h1>
        <p className="text-lg mb-4">Valor: {state.count}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => dispatch({ type: "increment" })}
            className="bg-green-500 px-3 py-1 rounded text-white"
          >
            + Incrementar
          </button>

          <button
            onClick={() => dispatch({ type: "decrement" })}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            - Decrementar
          </button>

          <button
            onClick={() => dispatch({ type: "reset" })}
            className="bg-gray-500 px-3 py-1 rounded text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
