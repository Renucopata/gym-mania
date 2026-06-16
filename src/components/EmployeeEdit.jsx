import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function EditEmployee({ onClose, carnetIdentidad }) {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axiosInstance.put(`/auth/update/${carnetIdentidad}`, employeeDetails);
      setSaving(false);
      onClose();
    } catch (err) {
      setSaving(false);
      setError("Error saving changes");
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
        <h2 className="text-xl font-bold mb-4 text-center">Editar Empleado</h2>
        <form className="space-y-4">
          <div>
            <label className="block font-semibold">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={employeeDetails.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Apellido:</label>
            <input
              type="text"
              name="apellido"
              value={employeeDetails.apellido}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Correo:</label>
            <input
              type="email"
              name="correo"
              value={employeeDetails.correo || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Número de Teléfono:</label>
            <input
              type="text"
              name="numero_telefono"
              value={employeeDetails.numero_telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Persona de Emergencia:</label>
            <input
              type="text"
              name="persona_emergencia"
              value={employeeDetails.persona_emergencia}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Contacto de Emergencia:</label>
            <input
              type="text"
              name="contacto_emergencia"
              value={employeeDetails.contacto_emergencia}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Rol:</label>
            <select
              name="rol"
              value={employeeDetails.rol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="empleado">Empleado</option>
            </select>
          </div>
        </form>
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-gymmania-orange text-white px-4 py-2 rounded hover:bg-gymmania-orange-dark"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

