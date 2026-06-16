import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../utils/AxiosInstance";
import BackButton from "../components/BackButton";
import AddClientModal from "../components/AddClientModal";
import ClientsDetailModal from "../components/ClientsDetailModal";
import EditClient from "../components/EdtiClient";
import DeleteClient from "../components/DeleteClient";

const ClientsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // To store the client to display
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // To control the modal visibility
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);


  const userRole = localStorage.getItem("rol");
  const itemsPerPage = 100;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const openEdit = (id) => {
    setSelectedClient(id);
    setIsEditOpen(true);
  };
  const closeEdit = () => setIsEditOpen(false);

  const openDelete = (id) => {
    setSelectedClient(id);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => setIsDeleteOpen(false);

  // Fetch clients and memberships from API
  const fetchData = async () => {
    try {
      const [clientsRes, membershipsRes] = await Promise.all([
        axiosInstance.get("/clients/getAll"),
        axiosInstance.get("/memberships/getAll"),
      ]);
      setClients(clientsRes.data.data);
      setMemberships(membershipsRes.data.data);
    } catch (error) {
      console.error("Error fetching clients/memberships:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset to the first page whenever the search query or tab changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // A client is "active" when they currently have a membership whose date
  // range includes today. This is computed, never stored (no DB change).
  const activeClientIds = useMemo(() => {
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (local)
    const ids = new Set();
    memberships.forEach((m) => {
      const start = String(m.fecha_inicio).slice(0, 10);
      const end = String(m.fecha_fin).slice(0, 10);
      if (start <= todayStr && todayStr <= end) {
        ids.add(String(m.carnet_identidad_cliente));
      }
    });
    return ids;
  }, [memberships]);

  const isClientActive = (client) =>
    activeClientIds.has(String(client.carnet_identidad));


  const openDetailsModal = (id) => {
    setSelectedClient(id); // Only store the ID
    setIsDetailsModalOpen(true); // Open the modal
  };
  
  const closeDetailsModal = () => {
    setSelectedClient(null);
    setIsDetailsModalOpen(false);
  };


  // Combined tab + search filter. Tabs use the computed membership status.
  const filteredClients = clients.filter((client) => {
    if (activeTab === "active" && !isClientActive(client)) return false;
    if (activeTab === "expired" && isClientActive(client)) return false;

    const query = searchQuery.toLowerCase();
    if (query) {
      const matches =
        client.carnet_identidad.toString().toLowerCase().includes(query) ||
        client.apellido.toLowerCase().includes(query) ||
        client.nombre.toLowerCase().includes(query);
      if (!matches) return false;
    }
    return true;
  });

  // Pagination logic
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <BackButton />
      <div className="w-[90vw] h-[90vh] bg-gymmania-panel shadow-lg rounded-lg p-3">
        <div className="p-4">
          {/* Breadcrumbs */}
          <div className="font-jaro text-md text-black mb-2">
            <span>Tablero</span> &gt; <span>Clientes</span>
          </div>

          {/* Tabs */}
          <div className="relative mb-4 border-b border-gray-200">
            <div className="font-jaro text-xl flex space-x-6">
              {["all", "active", "expired"].map((tab) => (
                <button
                  key={tab}
                  className={`relative pb-2 ${
                    activeTab === tab
                      ? "text-gymmania-orange font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "all" && "Todos los clientes"}
                  {tab === "active" && "Clientes activos"}
                  {tab === "expired" && "Clientes inactivos"}
                </button>
              ))}
            </div>
            <div
              className="absolute bottom-0 h-0.5 bg-gymmania-orange transition-all duration-300"
              style={{
                width: "150px",
                transform: `translateX(${
                  ["all", "active", "expired"].indexOf(activeTab) * 100
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
            <button
              onClick={openModal}
              className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark"
            >
              Nuevo Cliente
            </button>
          </div>

          {/* Client List */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="h-[400px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">CI</th>
                  <th className="border-b p-2">Nombre</th>
                  <th className="border-b p-2">Apellido</th>
                  <th className="border-b p-2">Estado</th>
                  <th className="border-b p-2">Añadido en</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
                      <tbody>
             {paginatedClients.map((client) => (
            <tr key={client.carnet_identidad} className="hover:bg-gray-50">
              <td className="p-2 border-b">{client.carnet_identidad}</td>
              <td className="p-2 border-b">{client.nombre}</td>
              <td className="p-2 border-b">{client.apellido}</td>
              <td className="p-2 border-b">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isClientActive(client)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isClientActive(client) ? "activo" : "inactivo"}
                </span>
              </td>
              <td className="p-2 border-b">
                {new Date(client.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td className="p-2 border-b">
                <button
                  onClick={() => openDetailsModal(client.carnet_identidad)}
                  className="mr-2 hover:text-gray-400"
                >
                  <i class="fa-solid fa-circle-info"></i>
                </button>
                <button
                  onClick={() => openEdit(client.carnet_identidad)}
                  className="mr-2 hover:text-gray-400"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                {(userRole === "admin" || userRole === "sistemas")&&(
                <button
                  onClick={() => openDelete(client.carnet_identidad)}
                  className="mr-2 hover:text-gray-400"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>)}
              
              </td>
            </tr>
          ))}
        </tbody>

            </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4">
            {Array.from({
              length: Math.ceil(filteredClients.length / itemsPerPage),
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
      {isModalOpen && (
        <AddClientModal
        onClose={closeModal}
        onAdded={fetchData}
        />
      )}
              {isDetailsModalOpen && (
                  <ClientsDetailModal
                    clientId={selectedClient}
                    onClose={closeDetailsModal}
                  />
                        )}
        {isEditOpen && (
          <EditClient
          clientId={selectedClient}
          onClose={closeEdit} />
        )}

        {isDeleteOpen && (
          <DeleteClient 
          id={selectedClient}
          onClose={closeDelete}/>
        )}

    </div>
  );
};

export default ClientsPage;
