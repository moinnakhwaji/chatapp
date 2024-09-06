import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
  const { isAdmin } = useSelector((state) => state.auth);

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminProtectedRoute;
