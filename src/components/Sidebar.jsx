import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
    
  return (
    <nav className="flex flex-col h-full">
      {/* Navigation links group */}
      <div className="flex-grow flex flex-col mt-4">
        <Link
          to="/clients"
          className="py-2 px-4 hover:bg-gymmania-orange after:block after:h-1 after:w-full after:bg-gradient-to-r after:from-gymmania-orange after:to-transparent"
        >
          Clientes
        </Link>
        <Link
          to="/memberships"
          className="py-2 px-4 hover:bg-gymmania-orange after:block after:h-1 after:w-full after:bg-gradient-to-r after:from-gymmania-orange after:to-transparent"
        >
          Membresías
        </Link>
        <Link
          to="/employees"
          className="py-2 px-4 hover:bg-gymmania-orange after:block after:h-1 after:w-full after:bg-gradient-to-r after:from-gymmania-orange after:to-transparent"
        >
          Personal
        </Link>
        <Link
          to="/charts"
          className="py-2 px-4 hover:bg-gymmania-orange after:block after:h-1 after:w-full after:bg-gradient-to-r after:from-gymmania-orange after:to-transparent"
        >
          Reportes
        </Link>
        
      </div>

      {/* Logout button - will stay at bottom */}
      <button
        onClick={logout}
        className="w-full py-2 px-4 mt-auto mb-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
    </nav>      
  );
}
 
