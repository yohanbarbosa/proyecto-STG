import React, { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
const Modal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  // Exponemos métodos al padre
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Soy un Modal</h2>
        <p>Este modal se controla desde el padre con useImperativeHandle.</p>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
});

function HookUseImperativeHandle() {
  const modalRef = useRef();

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
        <h1 className="text-2xl font-bold mb-4">Ejemlo de HookUseImperativeHandle</h1>

        <div className="p-6 space-x-2">
          <button
            onClick={() => modalRef.current.open()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Abrir Modal
          </button>

          <button
            onClick={() => modalRef.current.close()}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cerrar Modal
          </button>

          <Modal ref={modalRef} />
        </div>
      </div>
    </div>
  );
}

export default HookUseImperativeHandle;
