import { useState } from "react";
import { Link } from "react-router-dom";

function Count() {
    const [count, setCount] = useState(0);

    // function aumentar() {
    //     setCount(count + 1);
    // }
    // function disminuir() {
    //     setCount(count - 1);
    // }

    return (
        <div>
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
                    <h1 className="text-2xl font-bold mb-4">Ejemlo de HookUseState</h1>

                    <div className="text-center">
                        <h2>Count: <span className="font-semibold" >{count}</span></h2>
                        <div className="space-x-2">
                            {/* <button onClick={aumentar} className="cursor-pointer bg-green-800 p-3 rounded-[10px]" >Aumentar</button>
                    <button onClick={disminuir} className="cursor-pointer bg-red-900 p-3 rounded-[10px]" >disminuir</button> */}

                            <button onClick={() => setCount(count + 1)} className="cursor-pointer bg-green-800 p-3 rounded-[10px]" >Aumentar</button>
                            <button onClick={() => setCount(count - 1)} className="cursor-pointer bg-red-900 p-3 rounded-[10px]" >disminuir</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Count;