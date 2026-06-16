import React, { useState } from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function AddShiftModal({ onClose, carnetIdentidad }) {
  const [dias, setDias] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!dias || !horaEntrada || !horaSalida) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      console.log(carnetIdentidad);
      console.log(horaEntrada);
      console.log(horaSalida);

      const response = await axiosInstance.post("/auth/addShift", {
        ci: carnetIdentidad,
        days: dias,
        entrance: horaEntrada,
        exit: horaSalida,
      });

      if (response.data.message) {
        setSuccess("Turno agregado exitosamente.");
        setDias("");
        setHoraEntrada("");
        setHoraSalida("");
      }

      setTimeout(() => {
        onClose();
    }, 1000);
    } catch (err) {
      setError("Error al agregar el turno. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[90vw] max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Añadir Turno</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <div>
            <label className="block font-bold mb-1">Días</label>
            <input
              type="text"
              placeholder="Ejemplo: Lunes,Martes"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Hora de Entrada</label>
            <input
              type="time"
              value={horaEntrada}
              onChange={(e) => setHoraEntrada(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Hora de Salida</label>
            <input
              type="time"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-gymmania-orange text-white px-4 py-2 rounded hover:bg-gymmania-orange-dark"
            >
              Guardar Turno
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
