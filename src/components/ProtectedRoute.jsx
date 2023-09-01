import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ path, children, inx, ...rest }) => {
  let isAuthenticated = false;
  if (localStorage.getItem("role")) {
    isAuthenticated = true;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
