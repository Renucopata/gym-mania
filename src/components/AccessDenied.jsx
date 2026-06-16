import React from "react";
import { useNavigate } from "react-router-dom";

// Shown by AuthGuard when a logged-in user lacks the role required for a route
// (e.g. a non-admin opening the "add employee" page).
const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gymmania-black flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md text-center">
        <i className="fa-solid fa-lock text-5xl text-gymmania-orange mb-4"></i>
        <h1 className="font-jaro text-3xl mb-2">Acceso denegado</h1>
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para ver esta página. Esta sección
          está reservada para administradores.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gymmania-orange hover:bg-gymmania-orange-dark text-white font-jaro py-2 px-6 rounded-lg"
        >
          Volver al panel
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
