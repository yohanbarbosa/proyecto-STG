import React, { createContext, useContext, useState } from 'react';

// Crear contexto
const ThemeContext = createContext();

// Componente principal
 function HookUseContext() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={theme}>
      {/* Clase de fondo cambia según el tema */}
      <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <h1 className="text-2xl font-bold mb-4">Ejemplo de useContext </h1>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Cambiar a tema {theme === 'light' ? 'dark' : 'light'}
        </button>

        <div className="mt-6 space-x-2.5 " >
          <Boton />
          <Boton2 />

        </div>
      </div>
    </ThemeContext.Provider>
  );
}

// Componente que consume el contexto
function Boton() {
    const theme = useContext(ThemeContext);
  
    return (
      <button
        className={`px-6 py-3 rounded text-lg transition ${
          theme === 'dark'
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-200 text-black hover:bg-gray-300'
        }`}
      >
        Soy un botón con tema {theme}
       
      </button>
      
      
    );
  
  }
  function Boton2() {
    const theme = useContext(ThemeContext);
  
    return (
        <button
          className={`px-6 py-3 rounded text-lg transition ${
            theme === 'dark'
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          <a href="/">Volver</a> 
         
        </button>
        
        
      );
    
  
  }
 

export default HookUseContext


