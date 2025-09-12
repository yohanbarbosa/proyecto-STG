import { useState, useTransition } from "react";
import { Link } from "react-router-dom";

const bigList = Array.from({ length: 5000 }, (_, i) => `Elemento ${i + 1}`);

function HookUseTransition() {
  const [input, setInput] = useState("");
  const [list, setList] = useState(bigList);

  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    setInput(value);

    // Filtrado como transición
    startTransition(() => {
      const filtered = bigList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setList(filtered);
    });
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
      <div className="mx-auto w-lg">
        <h1 className="text-xl font-bold mb-4">Ejemplo con useTransition</h1>

        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Buscar..."
          className="border px-2 py-1 rounded mb-4 w-full"
        />

        {isPending && <p className="text-gray-500">Filtrando...</p>}

        <ul className="h-64 overflow-auto border p-2 rounded">
          {list.map((item, i) => (
            <li key={i} className="border-b py-1">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HookUseTransition;
