import React, { useState, useMemo } from 'react';

function ContadorConMemo() {
  const [contador, setContador] = useState(0);
  const [valor, setValor] = useState('');

  // Simulamos cálculo pesado
  const calculoPesado = (num) => {
    console.log('Calculando...');
    let resultado = 0;
    for (let i = 0; i < 1000000000; i++) {
      resultado += i;
    }
    return resultado + num;
  };

  // Memorizar resultado para no recalcular en cada render
  // Convertimos contador a número para evitar problemas
  const resultadoMemo = useMemo(() => calculoPesado(Number(contador)), [contador]);

  // Handler para input numérico que permite vacío
  const handleValorChange = (e) => {
    const val = e.target.value;
    // Permitimos solo números o cadena vacía
    if (val === '' || /^\d+$/.test(val)) {
      setValor(val);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Ejemplo useMemo</h1>

      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">
          Contador: <span className="text-blue-600">{contador}</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">Resultado cálculo pesado:</p>
        <p className="text-gray-800 font-mono break-words">{resultadoMemo}</p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setContador((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Incrementar contador
        </button>
      </div>

      <hr className="my-6" />

      <div className="flex flex-col items-center">
        <input
          type="text"
          value={valor}
          onChange={handleValorChange}
          placeholder="Otro valor (no afecta cálculo)"
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-3 text-gray-700">
          Valor: <span className="font-semibold">{valor}</span>
        </p>
      </div>
    </div>
  );
}

export default ContadorConMemo;
