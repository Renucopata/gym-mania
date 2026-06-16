import React, { useState } from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function RegisterModal({ onClose, onRegistered }) {
  const [ci, setCi] = useState("");
  const [huella, setHuella] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (ci && huella) {
        setError("Por favor, rellene solo uno de los campos.");
        return;
      }

      if (!ci && !huella) {
        setError("Por favor, rellene al menos uno de los campos.");
        return;
      }

      const data = ci
        ? { ci, method: "carnet" }
        : { ci: huella, method: "huella" };

      const response = await axiosInstance.post("/attendances/register", data);
      setSuccess(response.data.message); // Show success message
      if (onRegistered) onRegistered();
      setCi("");
      setHuella("");
    } catch (err) {
      console.error("Error registering attendance:", err);

      // Display the backend error message or fallback to a default error
      setError(err.response?.data?.error || "Error desconocido.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          <i className="fa-solid fa-rectangle-xmark"></i>
        </button>

        <h2 className="text-xl font-bold mb-4">Registro de asistencia</h2>

        {/* Display error or success messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Carnet</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="1243234"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              disabled={huella.length > 0}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Huella</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={huella}
              onChange={(e) => setHuella(e.target.value)}
              disabled={ci.length > 0}
            />
          </div>
          <button
            type="submit"
            className="bg-gymmania-orange text-white px-4 py-2 rounded hover:bg-gymmania-orange-dark"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

