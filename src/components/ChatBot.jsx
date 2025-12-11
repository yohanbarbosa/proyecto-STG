import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden z-[9999] flex flex-col">
          <div className="flex justify-between items-center p-3  text-white">

            <button
              onClick={toggleChat}
              className=" hover:bg-red-500 cursor-pointer  text-black  rounded-full p-1 transition w-8 h-8 flex items-center justify-center"
            >
              <Icon icon="mdi:close-thick" width="24" height="24"  />
            </button>
          </div>

          <iframe
            src="https://www.chatbase.co/chatbot-iframe/zatjRG0obpumvoS_Gp8bW"
            className="w-full flex-1"
            frameBorder="0"
            allow="microphone"
          ></iframe>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-green-600/50 transition-all hover:scale-110 z-[9999] focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Abrir chat"
      >
        <Icon icon="carbon:chat-bot" width="32" height="32" />
      </button>
    </>
  );
}
