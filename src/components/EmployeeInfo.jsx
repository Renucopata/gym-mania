import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance"; 

export default function EmployeeInfo({ onClose, carnetIdentidad }) {

    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchEmployeeDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/auth/getOne/${carnetIdentidad}`
          );
          setEmployeeDetails(response.data.data[0]);
          setLoading(false);
        } catch (err) {
          setError("Error fetching employee details");
          setLoading(false);
        }
      };
  
      fetchEmployeeDetails();
    }, [carnetIdentidad]);

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
      
  
    if (loading) {
      return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-center text-red-500">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-[90vw] max-w-md p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Detalles del Empleado</h2>
          <ul className="space-y-2">
            <li>
              <strong>Carnet de Identidad:</strong> {employeeDetails.carnet_identidad}
            </li>
            <li>
              <strong>Nombre:</strong> {employeeDetails.nombre} {employeeDetails.apellido}
            </li>
            <li>
              <strong>Correo:</strong> {employeeDetails.correo || "No disponible"}
            </li>
            <li>
              <strong>Número de Teléfono:</strong> {employeeDetails.numero_telefono}
            </li>
            <li>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {formatDate(employeeDetails.fecha_nacimiento)}
            </li>
            <li>
              <strong>Género:</strong> {employeeDetails.genero}
            </li>
            <li>
              <strong>Persona de Emergencia:</strong> {employeeDetails.persona_emergencia}
            </li>
            <li>
              <strong>Contacto de Emergencia:</strong> {employeeDetails.contacto_emergencia}
            </li>
            <li>
              <strong>Fecha de Contratación:</strong>{" "}
              {formatDate(employeeDetails.fecha_contratacion)}
            </li>
            <li>
              <strong>Rol:</strong> {employeeDetails.rol}
            </li>
            <li>
              <strong>Creado:</strong>{" "}
              {new Date(employeeDetails.created_at).toLocaleString("es-ES")}
            </li>
            <li>
              <strong>Última Actualización:</strong>{" "}
              {new Date(employeeDetails.updated_at).toLocaleString("es-ES")}
            </li>
          </ul>
          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="bg-gymmania-orange text-white px-4 py-2 rounded hover:bg-gymmania-orange-dark"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );

};

