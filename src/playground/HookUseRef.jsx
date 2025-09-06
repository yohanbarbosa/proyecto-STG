import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HookUseRef() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Hiciste click ' + ref.current + ' veces!');
  }

  return (
    <div>
      <button className='cursor-pointer bg-purple-400 p-2 rounded-xl' onClick={handleClick}>
        Dame click!
      </button>
      <br />
      <br />
      <br />
      <Link to="/">volver</Link>
    </div>
  );
}
