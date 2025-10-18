import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AppLayout({ children }) {

  const [user, setUser] = useState(null);
  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect (()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
      if(currentUser){
        setUser(currentUser);
        setLoading(false);
      }else{
        navigate("/login")
      }
    });
    return () => unsubscribe();
  },[navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="">
      <Topbar user={user} />
      <div className="flex w-full ">
        <Sidebar/>
       <div className="flex-1 p-6 w-[80%] ">{children}</div>
      </div>
    </div>
  );
}

export default AppLayout;
