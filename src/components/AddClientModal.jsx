import React, { useState } from "react";
import axiosInstance from '../utils/AxiosInstance';

export default function AddClientModal({ onClose }) {
    const [formData, setFormData] = useState({
        ci: "",
        name: "",
        lastName: "",
        email: "",
        cell: "",
        bday: "",
        gnre: "masculino",
        emergCntc: "",
        emergCell: "",
        photo: null,
        status: "activo",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    

    

    const fieldConfig = {
        ci: {
            label: "Carnet de Identidad",
            type: "text",
        },
        name: {
            label: "Nombre",
            type: "text",
        },
        lastName: {
            label: "Apellido",
            type: "text",
        },
        email: {
            label: "Correo Electrónico (opcional)",
            type: "email",
            required: false,
        },
        cell: {
            label: "Celular",
            type: "number",
            errorMessage: "Ingrese un número de celular válido de 8 dígitos.",
        },
        bday: {
            label: "Fecha de Nacimiento",
            type: "date",
        },
        gnre: {
            label: "Género",
            type: "select",
            options: [
                { value: "masculino", label: "Masculino" },
                { value: "femenino", label: "Femenino" },
                { value: "otro", label: "Otro" },
            ],
        },
        emergCntc: {
            label: "Contacto de Emergencia",
            type: "text",
        },
        emergCell: {
            label: "Teléfono de Emergencia",
            type: "number",
            errorMessage: "Ingrese un número de teléfono válido.",
        }
      
     
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const config = fieldConfig[name];

        // Handle validation if defined
        if (config.pattern && !new RegExp(config.pattern).test(value)) {
            setError(config.errorMessage || "Campo inválido.");
            return;
        }

        setError("");
        setFormData({ ...formData, [name]: value });
    };

    
      
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


        const submissionData = {
            ...formData,
            email: formData.email === "" ? null : formData.email

        };

        try {
            const response = await axiosInstance.post("/clients/addNew", submissionData);

            setSuccess(response.data.message);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Error adding client:", err);

            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6">Añadir Cliente</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {Object.entries(fieldConfig).map(([key, config]) => (
                            <div key={key} className="mb-2">
                                <label className="block mb-2 font-medium text-gray-700">
                                    {config.label}
                                </label>
                                {config.type === "select" ? (
                                    <select
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        {config.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : config.type === "button" ? (
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={config.onClick}
                                    >
                                        {config.label}
                                    </button>
                                ) : (
                                    <input
                                        type={config.type}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required={config.required !== false}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-gymmania-orange text-white px-6 py-2 rounded hover:bg-gymmania-orange-dark"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>

             
            
        </div>
    );
}



