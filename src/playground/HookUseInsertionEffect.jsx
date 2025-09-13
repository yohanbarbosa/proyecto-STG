import React, { useInsertionEffect, useState } from "react";
import { Link } from "react-router-dom";

function DynamicStyledBox({ color }) {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `.dynamic-box { background: ${color}; padding: 20px; border-radius: 8px; }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [color]);

  return <div className="dynamic-box">Caja con color dinámico</div>;
}

export default function App() {
  const [color, setColor] = useState("lightblue");

  return (
    <div className="flex items-center w-full h-screen">
      <div className="absolute top-10 left-5">
        <Link
          className="hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
          to="/"
        >
          Volver al homeHooks
        </Link>
      </div>
      <div className="w-lg m-auto">
        <h1 className="text-2xl font-bold mb-4">Ejemlo de HookUseInsertiomEffect</h1>
        <button
          onClick={() =>
            setColor(color === "lightblue" ? "lightgreen" : "lightblue")
          }
          className="px-4 py-2 bg-gray-800 text-white rounded mb-4"
        >
          Cambiar color
        </button>

        <DynamicStyledBox color={color} />
      </div>
    </div>
  );
}
