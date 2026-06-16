import React from "react";
import { useNavigate } from "react-router-dom";

// Reusable "go back" arrow. Defaults to a floating button in the top-left
// corner (for the full-screen pages that have no sidebar); pass className=""
// (or any positioning classes) to render it inline instead.
const BackButton = ({ className = "fixed top-4 left-4 z-50" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Volver"
      title="Volver"
      className={`${className} flex items-center justify-center w-10 h-10 rounded-full bg-gymmania-orange text-white shadow-lg hover:bg-gymmania-orange-dark focus:outline-none focus:ring-2 focus:ring-gymmania-orange`}
    >
      <i className="fa-solid fa-arrow-left"></i>
    </button>
  );
};

export default BackButton;
