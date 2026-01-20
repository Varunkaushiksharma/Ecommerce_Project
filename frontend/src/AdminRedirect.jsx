import { Navigate } from "react-router-dom";

const AdminRedirect = () => {
  return <Navigate to="/admin/auth" replace />;
};

export default AdminRedirect;
