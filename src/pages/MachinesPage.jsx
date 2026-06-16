import React, { useState } from "react";
import BackButton from "../components/BackButton";

const machineData = [
  {
    id: 1,
    name: "Treadmill 3000",
    type: "Cardio",
    purchaseDate: "2020-05-10",
    status: "active",
  },
  {
    id: 2,
    name: "Leg Press Pro",
    type: "Fuerza",
    purchaseDate: "2018-08-25",
    status: "maintenance",
  },
  {
    id: 3,
    name: "Elliptical X200",
    type: "Cardio",
    purchaseDate: "2019-12-15",
    status: "inactive",
  },
];

const MachinesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = machineData.filter((machine) => {
    if (activeTab === "active") return machine.status === "active";
    if (activeTab === "maintenance") return machine.status === "maintenance";
    return true; // For "all"
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <BackButton />
      <div className="w-[90vw] h-[90vh] bg-gymmania-panel shadow-lg rounded-lg p-6">
        {/* Breadcrumbs */}
        <div className="font-jaro text-md text-black mb-4">
          <span>Tablero</span> &gt; <span>Máquinas</span>
        </div>

        {/* Tabs */}
        <div className="relative mb-6 border-b border-gray-200">
          <div className="font-jaro text-xl flex space-x-6">
            {["all", "active", "maintenance"].map((tab) => (
              <button
                key={tab}
                className={`relative pb-2 ${
                  activeTab === tab
                    ? "text-gymmania-orange font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all" && "Todas las máquinas"}
                {tab === "active" && "Máquinas Activas"}
                {tab === "maintenance" && "Máquinas Inactivas"}
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-0 h-0.5 bg-gymmania-orange transition-all duration-300"
            style={{
              width: "170px",
              transform: `translateX(${
                ["all", "active", "maintenance"].indexOf(activeTab) * 100
              }%)`,
            }}
          ></div>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-jaro bg-gray-200 border rounded px-4 py-2 w-1/3"
          />
          <button className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark">
            Añadir Máquina
          </button>
        </div>

        {/* Machine List */}
        <div className="bg-white shadow-md rounded-lg p-4 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ID</th>
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Tipo</th>
                <th className="border-b p-2">Fecha de compra</th>
                <th className="border-b p-2">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((machine) => (
                <tr key={machine.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{machine.id}</td>
                  <td className="p-2 border-b">{machine.name}</td>
                  <td className="p-2 border-b">{machine.type}</td>
                  <td className="p-2 border-b">{machine.purchaseDate}</td>
                  <td className="p-2 border-b">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        machine.status === "active"
                          ? "bg-green-100 text-green-800"
                          : machine.status === "maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {machine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          {Array.from({
            length: Math.ceil(filteredData.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-gymmania-orange text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachinesPage;
