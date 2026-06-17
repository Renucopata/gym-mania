import React, { useState } from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function RegisterModal({ onClose, onRegistered }) {
  const [ci, setCi] = useState("");
  const [huella, setHuella] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);

  // Fetch the photo of the client who just entered (auth header is added by the
  // axios instance, so we pull it as a blob and turn it into an object URL).
  const fetchPhoto = async (clientCi) => {
    try {
      const res = await axiosInstance.get(`/clients/${clientCi}/photo`, {
        responseType: "blob",
      });
      setPhotoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(res.data);
      });
    } catch (err) {
      console.error("Error fetching client photo:", err);
      setPhotoUrl(null);
    }
  };

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

      const usedCi = ci || huella;
      const data = ci
        ? { ci, method: "carnet" }
        : { ci: huella, method: "huella" };

      const response = await axiosInstance.post("/attendances/register", data);
      setSuccess(response.data.message); // Show success message
      if (onRegistered) onRegistered();
      fetchPhoto(usedCi); // show who just entered
      setCi("");
      setHuella("");
    } catch (err) {
      console.error("Error registering attendance:", err);
      setPhotoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      // Display the backend error message or fallback to a default error
      setError(err.response?.data?.error || "Error desconocido.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto"
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

        {/* Photo of the client who just entered */}
        {success && (
          <div className="flex justify-center mb-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Cliente"
                className="w-40 h-40 rounded-full object-cover border-4 border-gymmania-orange"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex justify-center items-center text-gray-500">
                Sin foto
              </div>
            )}
          </div>
        )}

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

