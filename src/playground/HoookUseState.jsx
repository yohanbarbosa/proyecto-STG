import { useState } from "react";

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
            <h1>hello from Hook</h1>
            <div className="text-center">
                <h1>Count: <span className="font-semibold" >{count}</span></h1>
                <div className="space-x-2">
                    {/* <button onClick={aumentar} className="cursor-pointer bg-green-800 p-3 rounded-[10px]" >Aumentar</button>
                    <button onClick={disminuir} className="cursor-pointer bg-red-900 p-3 rounded-[10px]" >disminuir</button> */}

                    <button onClick={()=> setCount(count+1)} className="cursor-pointer bg-green-800 p-3 rounded-[10px]" >Aumentar</button>
                    <button onClick={()=> setCount(count-1)} className="cursor-pointer bg-red-900 p-3 rounded-[10px]" >disminuir</button>
                </div>
                <div className="mt-10">
                    <a href="/">Volver</a>
                </div>
            </div>
        </div>
    );
}


export default Count;