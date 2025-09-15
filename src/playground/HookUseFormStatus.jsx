import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { Link } from "react-router-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-3 py-1 rounded"
    >
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

function HookUseFormStatus() {
  const [message, setMessage] = useState("");

  async function handleAction(formData) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simula delay
    setMessage(`dato ingresado:  ${formData.get("name")}`);
  }

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
      <div className="mx-auto">
      <h1 className="text-xl font-bold mb-4">Ejemplo con useFormStatus</h1>

        <form
          action={handleAction}
          className="p-4 border rounded w-64 space-y-3"
        >
          <input
            name="name"
            placeholder="Tu nombre"
            className="border px-2 py-1 w-full"
          />
          <SubmitButton />
          {message && <p className="text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default HookUseFormStatus;
