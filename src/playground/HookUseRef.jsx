import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HookUseRef() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Hiciste click ' + ref.current + ' veces!');
  }

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
        <button className='cursor-pointer bg-purple-400 p-2 rounded-xl' onClick={handleClick}>
          Dame click!
        </button>
        <br />
        <br />
        <br />
      </div>
    </div>

  );
}
