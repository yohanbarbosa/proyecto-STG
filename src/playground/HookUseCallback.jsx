import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

function HookUseCallback() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");
    const fn1 = useCallback(() => {
        console.log("fn1 siempre igual ([])");
    }, []); // sin dependencias

    const fn2 = useCallback(() => {
        console.log("fn2 depende de count:", count);
    }, [count]); // depende de count

    const fn3 = useCallback(() => {
        console.log("fn3 depende de text:", text);
    }, [text]); // depende de text


    const increment = useCallback(() => {
        console.log("Contador actual:", count);
        setCount(count + 1);
    }, [count]);

    return (
        <div className="flex items-center w-full h-screen">
            <div className="mx-auto">
                <div className="">
                    <p>Count: {count}</p>
                    <button className="px-4 rounded-lg bg-green-600 hover:bg-green-500" onClick={increment}>Sumar</button>

                </div>
                <div className="mt-10">
                    <input
                        className="text-white"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Escribe algo"
                    />
                </div>

                <div className="mt-10">
                    <button className=" hover:bg-blue-500  bg-blue-600 px-2 rounded-[10px]">
                        <Link to="/">Volver al Home Hook</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HookUseCallback;
