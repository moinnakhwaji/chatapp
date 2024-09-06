// components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, user, redirect = "/login" }) => {
  if (!user) {
    return <Navigate to={redirect} />;
  }
  return children ? children : <Outlet></Outlet>;
};

export default ProtectedRoute;
