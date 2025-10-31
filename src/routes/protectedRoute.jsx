import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import Swal from "sweetalert2";

function protectedRoute({children}) {
    const { user } = auth;

    if(user){
        Swal.fire("llamen a jesusssssssssss");
        return <Navigate to="/login"/>
    }

    return children;
}


export default protectedRoute;