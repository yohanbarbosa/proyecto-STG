import React, { useId } from "react";
import { Link } from "react-router-dom";

function InputWithLabel({ label }) {
  const id = useId(); // genera un id único

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      <input id={id} type="text" className="border rounded px-2 py-1 w-full" />
    </div>
  );
}

function HookUseId() {
  return (
    <div className="flex w-full h-screen items-center">
      <div className="absolute top-5 left-5">
        <Link
          to="/"
          className="hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
        >
          Volver al HomeHooks
        </Link>
      </div>
      <div className="mx-auto min-w-xl">
        <h1 className="text-xl font-bold mb-4">Ejemplo con useId</h1>
        <InputWithLabel label="Nombre" />
        <InputWithLabel label="Correo" />
      </div>
    </div>
  );
}

export default HookUseId;
