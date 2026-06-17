import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import axiosInstance from "../utils/AxiosInstance";
import EmployeeEdit from "../components/EmployeeEdit";
import EmployeeInfo from "../components/EmployeeInfo";
import EmployeeShift from "../components/EmployeeShift";
import AddShiftModal from "../components/AddShiftModal";
import DeleteEmployee from "../components/DeleteEmployee";


const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const itemsPerPage = 10;

  const userRole = localStorage.getItem("rol");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/auth/getEmployees");
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);


  const openInfo = (id) => {
    setSelectedEmployee(id);
    setIsInfoOpen(true);
  };

  const openEdit = (id) => {
    setSelectedEmployee(id);
    setIsEditOpen(true);
  };

  const openShift = (id) => {
    setSelectedEmployee(id);
    setIsShiftOpen(true);
  };

  const openAddShift = (id) => {
    setSelectedEmployee(id);
    setIsAddShiftOpen(true);
  };

  const openDelete = (id) => {
    setSelectedEmployee(id);
    setIsDeleteOpen(true);
  };

  const closeInfo = () => {setIsInfoOpen(false)};
  const closeEdit = () => {setIsEditOpen(false)};
  const closeShift = () => {setIsShiftOpen(false)};
  const closeAddShift = () => {setIsAddShiftOpen(false)};
  const closeDelete = () => {setIsDeleteOpen(false)};

  // Toggle an employee's estado (activo <-> inactivo). This is a real DB change.
  const toggleStatus = async (employee) => {
    const newStatus = employee.estado === "activo" ? "inactivo" : "activo";
    try {
      await axiosInstance.put(`/auth/updateStatus/${employee.carnet_identidad}`, {
        estado: newStatus,
      });
      setEmployees((prev) =>
        prev.map((e) =>
          e.carnet_identidad === employee.carnet_identidad
            ? { ...e, estado: newStatus }
            : e
        )
      );
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };


  const filteredData = employees
    .filter((employee) => {
      if (activeTab === "active") return employee.estado === "activo";
      if (activeTab === "inactive") return employee.estado === "inactivo";
      return true; // For "all"
    })
    .filter(
      (employee) =>
        employee.carnet_identidad.toString().includes(searchQuery) ||
        employee.nombre.toLowerCase().includes(searchQuery)
    );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goAddEmployees = () => {
    navigate("/AddEmployees")
  }

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    } catch (error) {
        console.log(error)
      return "Fecha no válida";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <BackButton />
      <div className="w-[90vw] h-[90vh] bg-gymmania-panel shadow-lg rounded-lg p-6">
        {/* Breadcrumbs */}
        <div className="font-jaro text-md text-black mb-4">
          <span>Tablero</span> &gt; <span>Personal</span>
        </div>

        {/* Tabs */}
        <div className="relative mb-6 border-b border-gray-200">
          <div className="font-jaro text-xl flex space-x-6">
            {["all", "active", "inactive"].map((tab) => (
              <button
                key={tab}
                className={`relative pb-2 ${
                  activeTab === tab
                    ? "text-gymmania-orange font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === "all" && "Todo el personal"}
                {tab === "active" && "Personal Activo"}
                {tab === "inactive" && "Personal Inactivo"}
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-0 h-0.5 bg-gymmania-orange transition-all duration-300"
            style={{
              width: "150px",
              transform: `translateX(${
                ["all", "active", "inactive"].indexOf(activeTab) * 100
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
          {(userRole === "admin" || userRole === "sistemas")&&(
             <button className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark"
             onClick={goAddEmployees}>
               Añadir Personal
             </button>
          ) }
         
        </div>

        {/* Employee List */}
        <div className="bg-white shadow-md rounded-lg p-4">
        <div className="h-[400px] overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Carnet</th>
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Apellido</th>
                <th className="border-b p-2">Rol</th>
                <th className="border-b p-2">Fecha de empleo</th>
                <th className="border-b p-2">Estatus</th>
                <th className="border-b p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((employee) => (
                <tr key={employee.carnet_identidad} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{employee.carnet_identidad}</td>
                  <td className="p-2 border-b">{employee.nombre}</td>
                  <td className="p-2 border-b">{employee.apellido}</td>
                  <td className="p-2 border-b">{employee.rol}</td>
                  <td className="p-2 border-b">
                    {formatDate(employee.fecha_contratacion)}
                  </td>
                  <td className="p-2 border-b">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.estado}
                    </span>
                  </td >

                  <td className="p-2 border-b">
                      <button className="mr-2 hover:text-gray-400"
                              onClick={() => openInfo(employee.carnet_identidad)}>
                                <i class="fa-solid fa-circle-info"></i>
                      </button>
                     
                      <button className="mr-2 hover:text-gray-400"
                              onClick={() => openShift(employee.carnet_identidad)}>
                                <i class="fa-regular fa-calendar-days"></i>
                      </button>
                      <button className="mr-2 hover:text-gray-400"
                              onClick={() => openAddShift(employee.carnet_identidad)}>
                                <i class="fa-regular fa-calendar-plus"></i>
                      </button>
                     { (userRole === "admin" || userRole === "sistemas")&&
                      (<button className="mr-2"
                              title={employee.estado === "activo" ? "Desactivar" : "Activar"}
                              onClick={() => toggleStatus(employee)}>
                                <i className={`fa-solid ${employee.estado === "activo" ? "fa-toggle-on text-green-600" : "fa-toggle-off text-gray-400"}`}></i>
                      </button>)}
                     { (userRole === "admin" || userRole === "sistemas")&&
                      (<button className="mr-2 hover:text-gray-400"
                              onClick={() => openDelete(employee.carnet_identidad)}>
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
      {isInfoOpen && (<EmployeeInfo onClose={closeInfo} carnetIdentidad={selectedEmployee}/>)}
      {isEditOpen &&(<EmployeeEdit onClose={closeEdit} carnetIdentidad={selectedEmployee}/>)}
      {isShiftOpen && (<EmployeeShift onClose={closeShift} carnetIdentidad={selectedEmployee}/>)}
      {isAddShiftOpen && (<AddShiftModal onClose={closeAddShift} carnetIdentidad={selectedEmployee}/>)}
      {isDeleteOpen && (<DeleteEmployee onClose={closeDelete} id={selectedEmployee}/>)}
    </div>
  );
};

export default EmployeesPage;
