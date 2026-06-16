import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function EmployeeShift({ onClose, carnetIdentidad }) {
  const [shiftDetails, setShiftDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShiftDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/getShift/${carnetIdentidad}`
        );
        
        setShiftDetails(response.data.data);
        console.log(shiftDetails);
        setLoading(false);
      } catch (err) {
        setError( err);
        console.log(error);
        setLoading(false);
      }
    };

    fetchShiftDetails();
  }, [carnetIdentidad]);

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
    } catch (error) {
      return "Hora no válida";
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete( `/auth/remove/${id}`);
      alert(response.data.message);
      setTimeout(() => {
        onClose();
    }, 1000);
    } catch (error) {
      alert(error);
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    } catch (error) {
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

  if (shiftDetails === null) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-center text-red-500">Esta persona aun no tiene un turno de trabajo</p>
          
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
    <div className="bg-white w-[90vw] max-w-3xl p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Detalles de Turnos</h2>
      {shiftDetails.map((shift) => (
        <div
          key={shift.id}
          className="border-b border-gray-300 pb-4 mb-4 last:border-b-0"
        >
          <ul className="space-y-2">
            <li>
              <strong>Días de Trabajo:</strong> {shift.dias}
            </li>
            <li>
              <strong>Hora de Entrada:</strong> {formatTime(shift.hora_entrada)}
            </li>
            <li>
              <strong>Hora de Salida:</strong> {formatTime(shift.hora_salida)}
            </li>
            <li>
              <strong>Creado en:</strong> {formatDate(shift.creado_en)}
            </li>
          </ul>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handleDelete(shift.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-100"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
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
}

