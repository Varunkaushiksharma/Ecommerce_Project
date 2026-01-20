import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const token = sessionStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/auth" replace />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
