import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
   
      <div className="absolute top-5 left-5 ">
        <Link
          className=" hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
          to="/"
        >
          Volver al HomeHooks
        </Link>
      </div>

      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ejemlo de HookUseEffect</h1>

      
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
