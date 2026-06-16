import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import axiosInstance from "../utils/AxiosInstance";
import AddMemberModal from "../components/AddMemberModal";
import MembershipsDetailsModal from "../components/MembershipsDetailModal";
import DeleteMembership from "../components/DeleteMembership";


const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // To store the client to display
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchedMemberships, setSearchedMemberships] = useState([]);
  const handleModalClose = () => setIsModalOpen(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const userRole = localStorage.getItem("rol");
  const itemsPerPage = 100;

  // Fetch memberships from the API
  const fetchMemberships = async () => {
    try {
      const response = await axiosInstance.get("/memberships/getAll");
      setMemberships(response.data.data); // Save the memberships data in state
    } catch (err) {
      console.error("Error fetching memberships:", err);
      setError("No se pudo obtener la lista de membresías. Inténtalo más tarde.");
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  useEffect(() => {
      const query = searchQuery.toLowerCase();
      const filtered = memberships.filter(
        (membership) =>
          membership.carnet_identidad_cliente.toString().includes(query)

      );
      setSearchedMemberships(filtered);
      setCurrentPage(1); // Reset to the first page whenever the search query changes
    }, [searchQuery, memberships]);


  const openDetailsModal = (id) => {
    setSelectedClient(id); // Only store the ID
    setIsDetailsModalOpen(true); // Open the modal
  };
  
  const closeDetailsModal = () => {
    setSelectedClient(null);
    setIsDetailsModalOpen(false);
  };


  const openDelete = (id) =>{
    setSelectedClient(id);
    setIsDeleteOpen(true);
  }
 
  const closeDelete = () => {setIsDeleteOpen(false)};

  // Paginate memberships
  const paginatedData = searchedMemberships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <BackButton />
      <div className="w-[90vw] h-[90vh] bg-gymmania-panel shadow-lg rounded-lg p-6">
        {/* Breadcrumbs */}
        <div className="font-jaro text-md text-black mb-4">
          <span>Tablero</span> &gt; <span>Membresías</span>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar por Carnet de Identidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-jaro bg-gray-200 border rounded px-4 py-2 w-1/3"
          />
          <button className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark"
                  onClick={() => {setIsModalOpen(true)}}>
            Añadir Membresía
          </button>
        </div>

        {/* Memberships List */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="h-[400px] overflow-y-auto">
          {error ? (
            <p className="text-red-600 font-medium mb-4">{error}</p>
          ) : memberships.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">ID</th>
                  <th className="border-b p-2">CI Cliente</th>
                  <th className="border-b p-2">Fecha Inicio</th>
                  <th className="border-b p-2">Fecha Fin</th>
                  <th className="border-b p-2">Monto Pagado</th>
                  <th className="border-b p-2">Descuento</th>
                  <th className="border-b p-2">Método de Pago</th>
                  <th className="border-b p-2">Inscrito por</th>
                  <th className="border-b p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{membership.id}</td>
                    <td className="p-2 border-b">{membership.carnet_identidad_cliente}</td>
                    <td className="p-2 border-b">
                    {new Date(membership.fecha_inicio).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                          })}
                    </td>
                    <td className="p-2 border-b">
                    {new Date(membership.fecha_fin).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                          })}
                    </td>
                    <td className="p-2 border-b">{membership.monto_pagado}</td>
                    <td className="p-2 border-b">
                      {membership.descuento} ({membership.descripcion_descuento})
                    </td>
                    <td className="p-2 border-b">{membership.metodo_pago}</td>
                    <td className="p-2 border-b">{membership.inscrito_por_nombre}</td>
                    <td className="p-2 border-b">
                        <button
                          onClick={() => openDetailsModal(membership.id)}
                          className="mr-2 hover:text-gray-400"
                        >
                          <i class="fa-solid fa-circle-info"></i>
                        </button>

                        {(userRole === "admin" || userRole === "sistemas")&&(<button
                          onClick={() => openDelete(membership.id)}
                          className="mr-2 hover:text-gray-400"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>)}
                      
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay membresías registradas.</p>
          )}
        </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-end mt-4">
          {Array.from({ length: Math.ceil(searchedMemberships.length / itemsPerPage) }).map((_, index) => (
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
      {isModalOpen && (
        <AddMemberModal
          onClose={handleModalClose}
          onAdded={fetchMemberships}
        />
      )}
      {isDetailsModalOpen && (
        <MembershipsDetailsModal
          membershipId={selectedClient}
          onClose={closeDetailsModal}
        />
      )}
      {isDeleteOpen && (
        <DeleteMembership 
        id={selectedClient}
        onClose={closeDelete}/>
      )}
    </div>
  );
};

export default MembershipsPage;
