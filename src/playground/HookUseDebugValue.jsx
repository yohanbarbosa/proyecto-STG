import { useState, useEffect, useDebugValue } from "react";
import { Link } from "react-router-dom";

function userUserStatus() {
    const [isOnline, SetOnline] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => SetOnline(true), 3000);
        return () => clearTimeout(timer);
    }, []);


    useDebugValue(isOnline ? "🟢 Online" : "🔴 Offline");
    return isOnline;
}

function HookDebugValue() {
    const userStatus = userUserStatus();
    return (
        <div className="">
            <div className="absolute top-5 left-5 ">
                <Link
                    className=" hover:bg-blue-500  bg-blue-600 px-2 py-2 rounded-[10px]"
                    to="/"
                >
                    Volver al HomeHooks
                </Link>
            </div>
            <div className="">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold mb-4">Ejemlo de HookUseDebugValue</h1>
                </div>

                <h2>Estado del usuario: {userStatus ? "conectado" : "Desconectado"}</h2>
            </div>
        </div>
    );
}

export default HookDebugValue;