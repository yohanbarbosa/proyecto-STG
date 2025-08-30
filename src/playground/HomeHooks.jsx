import React from "react";

function HomeHooks (){
    return(
        <div className="flex justify-center h-[100px]">

            <div className="text-center">
                <h2>ejemplos de hook</h2>
                <div className="mt-5 grid grid-rows-2 gap-2">
                    <a href="/useState" className="border-cyan-900 border-1 p-2">ir a useState</a>
                    <a href="/useNavigate" className="border-cyan-900 border-1 p-2">ir a useNavigate</a>
                </div>
            </div>
        </div>
    );

}

export default HomeHooks;