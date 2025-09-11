import { useState, useDeferredValue } from "react";
import { Link } from "react-router-dom";

function HookUseDeferrendValue() {
  const [query, setQuery] = useState("");

  const items = Array.from({ length: 20000 }, (_, i) => `Item ${i}`);

  const deferredQuery = useDeferredValue(query);

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="">
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-2 py-1"
        />
        <ul>
          {filtered.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="absolute top-5 left-5 ">
        <Link
          className=" hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
          to="/"
        >
          Volver al HomeHooks
        </Link>
      </div>
    </div>
  );
}

export default HookUseDeferrendValue;
