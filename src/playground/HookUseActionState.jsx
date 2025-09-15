import { useActionState } from "react";
import { Link } from "react-router-dom";


async function addToList(prevMessage, formData) {
  const item = formData.get("item");
  await new Promise((res) => setTimeout(res, 1000));
  return `Agregaste ${item}`;
}

function HookUseActionState(params) {
  const [message, formAction, isPending] = useActionState(addToList, null);
  return (
    <div className="flex w-full h-screen items-center">

      <div className="absolute top-5 left-5 ">
        <Link
          className=" hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
          to="/"
        >
          Volver al HomeHooks
        </Link>
      </div>

      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ejemlo de HookUseActionState</h1>

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
