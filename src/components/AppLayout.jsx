import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Icon from "@mdi/react";

function AppLayout({ children }) {
  return (
    <div className="">
      <Topbar/>
      <div className="flex w-full ">
        <Sidebar/>
       <div className="flex-1 p-6 w-[80%] ">{children}</div>
      </div>
    </div>
  );
}

export default AppLayout;
