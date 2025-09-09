import { useActionState } from "react";
import { Form } from "react-router-dom";

async function addToList(prevMessage, formData) {
  const item = formData.get("item");
  await new Promise((res) => setTimeout(res, 1000));
  return `Agregaste ${item}`;
}

function HookUseActionState(params) {
  const [message, formAction, isPending] = useActionState(addToList, null);
  return (
    <div className="flex w-full h-screen items-center">
      <div className="mx-auto">
        <form action={formAction} className="p-4 border rounded w-80">
          <h2 className="text-lg font-bold mb-2">Lista de compras</h2>

          <input
            type="text"
            name="item"
            placeholder="Escribe un producto..."
            className="border px-2 py-1 rounded w-full mb-2"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Agregar
          </button>

          <p className="mt-3">{isPending ? "⏳ Cargando..." : message}</p>
        </form>
      </div>
    </div>
  );
}

export default HookUseActionState;
