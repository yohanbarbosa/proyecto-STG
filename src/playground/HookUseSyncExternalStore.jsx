import React, { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";

// counterStore.js
let count = 0;
let listeners = new Set();

function increment() {
  count++;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return count;
}

// Counter.jsx

 function hookUseSyncExternalStore() {
  const count = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div className="w-full h-screen flex items-center">
      <div className="absolute top-5 left-5 ">
        <Link
          className=" hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
          to="/"
        >
          Volver al HomeHooks
        </Link>
      </div>
      <div className="mx-auto w-60">
      <h1 className="text-2xl font-bold mb-4">Ejemplo de HookUseSyncExternalStore</h1>
        <h2 className="text-xl">Contador: {count}</h2>
        <button
          onClick={increment}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Incrementar
        </button>
      </div>
    </div>
  );
}

export default hookUseSyncExternalStore;
