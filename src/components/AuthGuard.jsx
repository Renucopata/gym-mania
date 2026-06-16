import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import AccessDenied from "./AccessDenied";

// Guards a route. Without `roles`, any authenticated user may pass. With
// `roles` (e.g. ["admin"]), the user's stored role must be in the list.
// - Not logged in  -> redirect to "/" with a message the welcome page shows.
// - Wrong role     -> render the AccessDenied screen.
const AuthGuard = ({ children, roles }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          authMessage: "Debes iniciar sesión para acceder a esa página.",
        }}
      />
    );
  }

  if (roles && roles.length > 0) {
    const userRole = localStorage.getItem("rol");
    if (!roles.includes(userRole)) {
      return <AccessDenied />;
    }
  }

  return children;
};

export default AuthGuard;
