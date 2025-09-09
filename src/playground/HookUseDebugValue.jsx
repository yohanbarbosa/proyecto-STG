import { useState, useEffect, useDebugValue } from "react";

function userUserStatus() {
    const [ isOnline, SetOnline] = useState(false);

    useEffect(()=> {
        const timer = setTimeout(()=> SetOnline(true),3000);
        return () => clearTimeout(timer);
    },[]);


    useDebugValue(isOnline ? "🟢 Online" : "🔴 Offline");
    return isOnline;
}

function HookDebugValue() {
    const userStatus = userUserStatus();
    return (
        <div className="">
            <h1>Estado del usuario: {userStatus ? "conectado" : "Desconectado"}</h1>
        </div>
    );
}

export default HookDebugValue;