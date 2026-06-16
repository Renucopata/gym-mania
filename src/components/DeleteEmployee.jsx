import React, {useState} from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function DeleteEmployee({ onClose, id }) {

const [success, setSuccess] = useState("");

  const handleDelete = async () => {
    try {
      const result = await axiosInstance.delete(`/auth/removeEmployee/${id}`);
      setSuccess(result.data.message);
      setTimeout(() => {
        onClose();
    }, 1000);
    } catch (error) {
      alert("Ocurrió un error al eliminar a la persona (Asegurese que esta persona no hay inscrito ninguna membresia)");
      setTimeout(() => {
        onClose();
    }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[90vw] max-w-md p-6 rounded-lg shadow-lg">
      {success && <p className="text-green-500 mb-4">{success}</p>}
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
          ¿Estás seguro?
        </h2>
        <p className="text-center mb-6">
          ¿Estás seguro de que deseas eliminar a esta persona? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
          >
            Sí, eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
