import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default AuthGuard;
