import React from "react";
import { Link, useNavigate } from "react-router-dom";

function HookUseNavigate(){

    const navigate = useNavigate();

    function GoRoute(){
        navigate('/useState')
    }
    return(
        <div>
            <div className="text-center">
                <h2>ejemplos de navigate</h2>
                <div className="mt-5">
                    <button onClick={GoRoute} >ruta navigate a useState</button>
                    <a href="/" className="border-cyan-900 border-1 p-2">ir a home</a>
                    <Link to="/name-route">ruta de ejemplo</Link>
                    </div>
            </div>
        </div>
    )
}

export default HookUseNavigate