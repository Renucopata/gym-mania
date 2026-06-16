import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AttendanceList from "../components/AttendanceList";

import RegisterButton from "../components/RegisterButton";
import RegisterModal from "../components/RegisterModal";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SideBarOpen, setSideBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state

  function toggleNavMenu() {
    setSideBarOpen(!SideBarOpen);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          SideBarOpen ? "w-64" : "w-16"
        } bg-gymmania-black text-white transition-all duration-300 h-full flex flex-col`}
      >
        <button
          className="p-4 focus:outline-none text-white hover:bg-gymmania-orange"
          onClick={toggleNavMenu}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        {SideBarOpen && <Sidebar />}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gymmania-panel shadow-md">
          <h1 className="font-jaro text-3xl hidden lg:block">¡Gym Mania!</h1>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="font-jaro text-4xl text-black">
              Control de asistencias
            </span>
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery} // Bind to searchQuery state
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery
            className="font-jaro bg-gray-200 border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-gymmania-orange hidden lg:block"
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-1 p-4 relative">
          {/* Pass searchQuery to AttendanceList */}
          <AttendanceList searchQuery={searchQuery} />

          {/* Register Button */}
          <RegisterButton onClick={() => setIsModalOpen(true)} />

          {/* Register Modal */}
          {isModalOpen && <RegisterModal onClose={() => setIsModalOpen(false)} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
