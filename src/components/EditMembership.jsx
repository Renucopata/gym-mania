import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";

// Only these columns are accepted by the backend update endpoint
// (subscripcion whitelist). carnet_identidad_cliente / inscrito_por are not
// editable here.
export default function EditMembership({ membershipId, onClose, onUpdated }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await axiosInstance.get(
          `/memberships/getOne/${membershipId}`
        );
        const m = response.data.data[0];
        setFormData({
          tipo: m.tipo || "Mensual",
          fecha_inicio: String(m.fecha_inicio || "").slice(0, 10),
          fecha_fin: String(m.fecha_fin || "").slice(0, 10),
          monto_pagado: m.monto_pagado ?? "",
          descuento: m.descuento ?? "",
          descripcion_descuento: m.descripcion_descuento || "",
          metodo_pago: m.metodo_pago || "efectivo",
          entradas: m.entradas ?? "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching membership:", err);
        setError("Error al obtener los datos de la membresía.");
        setLoading(false);
      }
    };
    fetchMembership();
  }, [membershipId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      tipo: formData.tipo,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      monto_pagado: parseFloat(formData.monto_pagado),
      descuento: parseFloat(formData.descuento) || 0,
      descripcion_descuento: formData.descripcion_descuento || null,
      metodo_pago: formData.metodo_pago,
      entradas: formData.entradas === "" ? null : parseInt(formData.entradas),
    };

    try {
      const response = await axiosInstance.put(
        `/memberships/update/${membershipId}`,
        payload
      );
      alert(response.data.message || "Membresía actualizada correctamente.");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating membership:", err);
      setError(
        err.response?.data?.error ||
          "Ocurrió un error inesperado. Inténtalo de nuevo."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 sm:p-8 rounded shadow-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Editar Membresía</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {formData && (
          <form onSubmit={saveChanges}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Tipo de Plan</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  {["Mensual", "Bi Mensual", "Trimestral", "Semestral", "Anual", "Sesiones"].map(
                    (opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Método de Pago</label>
                <select
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="qr">QR</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Fecha de Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Fecha de Finalización</label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Costo (Bs)</label>
                <input
                  type="number"
                  step="0.01"
                  name="monto_pagado"
                  value={formData.monto_pagado}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Descuento (Bs)</label>
                <input
                  type="number"
                  step="0.01"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Descripción del Descuento</label>
                <input
                  type="text"
                  name="descripcion_descuento"
                  value={formData.descripcion_descuento}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Entradas (opcional)</label>
                <input
                  type="number"
                  step="1"
                  name="entradas"
                  value={formData.entradas}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
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
                disabled={isSaving}
                className="font-jaro bg-gymmania-orange text-white px-6 py-2 rounded shadow hover:bg-gymmania-orange-dark disabled:opacity-60"
              >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
