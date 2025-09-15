import { useOptimistic, useState } from "react";
import { Link } from "react-router-dom";

 function HookUseOptimistic() {
  const [comments, setComments] = useState([
    { id: 1, text: "¡Hola!" },
    { id: 2, text: "Me gusta React 19 🚀" },
  ]);

  // Hook useOptimistic
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment) => [...state, newComment]
  );
  const [inputValue, setInputValue] = useState("");

  async function handleAddComment(text) {
    const tempComment = { id: Date.now(), text: inputValue };

    addOptimisticComment(tempComment);
    setInputValue("");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setComments((prev) => [...prev, tempComment]);
  }

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
      <div className="mx-auto">
        <h1 className="text-xl font-bold mb-2">Ejemplo de HookUseOptimistic</h1>

        <h2 className="text-xl font-bold mb-2">Comentarios</h2>

        <div className="flex gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />

          <button
            onClick={() => handleAddComment("Nuevo comentario 🚀")}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Agregar comentario
          </button>
        </div>
        <div className="">
          <ul className="mb-4">
            {optimisticComments.map((c) => (
              <li key={c.id} className="border-b py-1">
                {c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default HookUseOptimistic;