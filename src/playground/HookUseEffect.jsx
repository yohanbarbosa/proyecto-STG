import React, { useState, useEffect } from "react";

function HomeHooks() {
  const [connected, setConnected] = useState(false);

  const connect = () => {
    console.log("Conectando...");
    setConnected(true);
  };

  const disconnect = () => {
    console.log("Desconectando...");
    setConnected(false);
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);
  
  const toggleConnection = () => {
    connected ? disconnect() : connect();
  };

  return (
    <div className="flex justify-center items-center h-[150px]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ejemplo de HookEffect</h2>
        <p className={`mb-6 font-medium ${connected ? "text-green-600" : "text-red-600"}`}>
          {connected ? "Conectado ✅" : "Desconectado ❌"}
        </p>
        <button
          onClick={toggleConnection}
          className={`px-6 py-2 rounded text-white font-semibold transition-colors ${
            connected ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {connected ? "Desconectar" : "Conectar"}
        </button>

        <div className="mt-10">
          <a href="/" className="text-blue-600  hover:text-blue-800">
            Volver
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomeHooks;
