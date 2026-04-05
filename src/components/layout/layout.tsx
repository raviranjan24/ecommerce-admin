import { Outlet } from "react-router-dom";
import Sidebar from "../common/sidebar";
import Topbar from "../common/topbar";

const DashboardLayout = () => {
  return (
    <>
      <Sidebar />
      <Topbar />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;