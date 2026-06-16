import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance"; // Import your axios instance

export default function AttendanceList({ searchQuery }) {
  const [attendances, setAttendances] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axiosInstance.get("/attendances/getTodays"); //change for a view with the name
        setAttendances(response.data); // Save the response data in state
      } catch (err) {
        console.error("Error fetching attendances:", err);
        setError("No se pudo obtener la lista de asistencias. Inténtalo más tarde.");
      }
    };
    fetchAttendances();
  }, []);

  // Filter attendances based on searchQuery
  const filteredAttendances = attendances.filter((attendance) =>
    attendance.ci_cliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white shadow rounded p-4 overflow-y-auto sm:overflow-auto max-h-screen sm:max-h-[75vh]">
      <h2 className="text-xl font-bold mb-4">Asistencias del día</h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 font-medium mb-4">
          {error}
        </p>
      )}

      {/* Attendance Table */}
      {filteredAttendances.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">Cliente</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Hora de registro</th>
              <th className="py-2 px-4 border-b">Método de registro</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendances.map((attendance) => (
              <tr key={attendance.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{attendance.ci_cliente}</td>
                <td className="py-2 px-4 border-b">{attendance.nombre}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(attendance.hora_de_registro).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="py-2 px-4 border-b">{attendance.metodo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No hay asistencias registradas hoy.</p>
      )}
    </div>
  );
}



