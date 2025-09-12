import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function HookuseLayoutEffect() {
  const [messages, setMessages] = useState([
    "Hola 👋",
    "¿Cómo estás?",
    "React 19 está genial 🚀",
  ]);

  const chatRef = useRef(null);

  // Siempre hacer scroll al final
  useLayoutEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]); // corre cada vez que cambian los mensajes

  function addMessage() {
    setMessages((prev) => [...prev, "Nuevo mensaje 📝"]);
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
      <div className="w-xl mx-auto">
        <div
          ref={chatRef}
          className="border h-40 overflow-y-auto p-2 bg-gray-100 rounded"
        >
          {messages.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>

        <button
          onClick={addMessage}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Agregar mensaje
        </button>
      </div>
    </div>
  );
}

export default HookuseLayoutEffect;
