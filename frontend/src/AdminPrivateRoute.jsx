import { Navigate, Outlet } from "react-router-dom";

export default function AdminPrivateRoute() {
  const token = sessionStorage.getItem("admin_token");

  return token ? <Outlet /> : <Navigate to="/admin/auth" />;
}