import React, { useState} from "react";
import axiosInstance from '../utils/AxiosInstance';

export default function AddMemberModal({onClose, onAdded}) {
    const [formData, setFormData] = useState({
        ci: "",
        start: "",
        end: "",
        amount: "",
        method: "efectivo",
        subBy: "",
        type: "Mensual", // Default value
        disc: "",
        descrDisc: "",
        entries: "",
    });
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fieldConfig = {
        ci: {
            label: "Carnet de Identidad",
            type: "text",
        },
        type: {
            label: "Tipo de Plan",
            type: "select",
            options: [
                { value: "Mensual", label: "Mensual" },
                { value: "Bi Mensual", label: "Bi Mensual" },
                { value: "Trimestral", label: "Trimestral" },
                { value: "Semestral", label: "Semestral" },
                { value: "Anual", label: "Anual" },
                {value: "Sesiones", label: "Sesiones"}
            ]
        },
        start: {
            label: "Fecha de Inicio",
            type: "date",
        },
        end: {
            label: "Fecha de Finalización",
            type: "date",
        },
        amount: {
            label: "Costo (Bs)",
            type: "number",
            step: "0.01",
            validation: (value) => {
                if (value === "" || value === null) return true;  // Allow empty values
                const num = parseFloat(value);
                return !isNaN(num) && num >= 0;
            },
            errorMessage: "Por favor ingrese un monto válido"
        },
        disc: {
            label: "Descuento (Bs)",
            type: "number",
            step: "0.01",
            required: false,  // Make it explicitly not required
            validation: (value) => {
                if (value === "" || value === null) return true;  // Allow empty values
                const num = parseFloat(value);
                return !isNaN(num) && num >= 0;
            },
            errorMessage: "Por favor ingrese un descuento válido"
        },
        descrDisc: {
            label: "Descripción del Descuento",
            type: "text",
            required: false,
        },
        method: {
            label: "Método de Pago",
            type: "select",
            options: [
                { value: "efectivo", label: "Efectivo" },
                { value: "qr", label: "QR" },
                { value: "tarjeta", label: "Tarjeta" }
            ]
        },
        subBy: {
            label: "Inscrito Por (Carnet)",
            type: "text",
        },
        entries: {
            label: "Entradas (opcional)",
            type: "number",
            step: "1",
            required: false,
            validation: (value) => {
                if (value === "" || value === null) return true;
                const num = parseInt(value);
                return !isNaN(num) && Number.isInteger(num) && num >= 0;
            },
            errorMessage: "Por favor ingrese un número entero válido o deje el campo vacío"
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const config = fieldConfig[name];

        // Special handling for entries field
        if (name === 'entries') {
            if (value === '') {
                setFormData({ ...formData, [name]: '' });
                return;
            }
            const intValue = parseInt(value);
            if (!Number.isInteger(intValue)) {
                setError("El campo Entradas debe ser un número entero");
                return;
            }
        }

        // Validate if there's a validation function
        if (config.validation && !config.validation(value)) {
            setError(config.errorMessage);
            return;
        }

        setError("");
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate all numeric fields before submission
        const numericFields = ['amount', 'disc'];
        for (const field of numericFields) {
            if (formData[field] !== "" && fieldConfig[field].validation && 
                !fieldConfig[field].validation(formData[field])) {
                setError(`${fieldConfig[field].label}: ${fieldConfig[field].errorMessage}`);
                return;
            }
        }

        // Validate entries only if it's not empty
        if (formData.entries !== "" && !fieldConfig.entries.validation(formData.entries)) {
            setError(`${fieldConfig.entries.label}: ${fieldConfig.entries.errorMessage}`);
            return;
        }

        // Prepare the data for API submission
        const submissionData = {
            ...formData,
            amount: parseFloat(formData.amount),
            disc: parseFloat(formData.disc) || 0,
            entries: formData.entries === "" ? null : parseInt(formData.entries),
            descrDisc: formData.descrDisc || null
        };

        try {
            const response = await axiosInstance.post("/memberships/addNew", submissionData);

            setSuccess(response.data.message);
            if (onAdded) onAdded();
            setTimeout(() => {
                onClose(); // code to run after delay
              }, 2500);
            
          
          } catch (err) {
            console.error("Error adding membership:", err);
      
            // Extract error message from the backend response
            if (err.response && err.response.data && err.response.data.error) {
              setError(err.response.data.error); // Display backend error message
            } else {
              setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
            }
          }
          
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 sm:p-8 rounded shadow-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6">Añadir Membresía</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        {Object.entries(fieldConfig).map(([key, config]) => (
                            <div key={key} className="mb-2">
                                <label className="block mb-2 font-medium text-gray-700">
                                    {config.label}
                                </label>
                                {config.type === 'select' ? (
                                    <select
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        {config.options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={config.type}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required={config.required !== false}
                                        step={config.step}
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
                            className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

