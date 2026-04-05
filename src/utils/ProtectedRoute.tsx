import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLogin = localStorage.getItem("isLogin");
  return isLogin === "true" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;