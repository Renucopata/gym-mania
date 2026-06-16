import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";

export default function MembershipDetailsModal({ membershipId, onClose }) {
  const [membershipData, setMembershipData] = useState(null);
  const [clientPhoto, setClientPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await axiosInstance.get(
          `/memberships/getOne/${membershipId}`
        );
        const data = response.data.data[0];
        console.log(data);
        setMembershipData(data);
        await fetchClientPhoto(data.carnet_identidad_cliente); // Fetch client photo
        setLoading(false);
      } catch (err) {
        console.error("Error fetching membership data:", err);
        setError("Error al obtener los datos de la membresía.");
        setLoading(false);
      }
    };

    const fetchClientPhoto = async (clientCi) => {
      try {
        const response = await axiosInstance.get(
          `/clients/${clientCi}/photo`,
          { responseType: "blob" }
        );
        const photoUrl = URL.createObjectURL(response.data);
        setClientPhoto(photoUrl);
      } catch (err) {
        console.error("Error fetching client photo:", err);
        setClientPhoto(null);
      }
    };

    fetchMembershipData();
  }, [membershipId]);

  if (loading) return <div className="p-4">Cargando datos de la membresía...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
      " " +
      date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Section */}
        <div className="w-1/3 flex flex-col items-center">
          {clientPhoto ? (
            <img
              src={clientPhoto}
              alt="Foto del Cliente"
              className="w-48 h-48 rounded-full mb-4 object-cover"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex justify-center items-center text-gray-500 mb-4">
              Sin foto
            </div>
          )}
        </div>

        {/* Membership Info Section */}
        <div className="w-2/3 pl-6">
          <h2 className="text-2xl font-bold mb-4">Detalles de la Membresía</h2>
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="font-bold pr-4 py-2">CI Cliente:</td>
                <td>{membershipData.carnet_identidad_cliente}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Cliente:</td>
                <td>{membershipData.nombre_cliente}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Fecha Inicio:</td>
                <td>{formatDateTime(membershipData.fecha_inicio)}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Fecha Fin:</td>
                <td>{formatDateTime(membershipData.fecha_fin)}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Monto Pagado:</td>
                <td>{membershipData.monto_pagado}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Descuento:</td>
                <td>{membershipData.descuento}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Descripción Descuento:</td>
                <td>{membershipData.descripcion_descuento || "No disponible"}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Método de Pago:</td>
                <td>{membershipData.metodo_pago}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Inscrito Por(Carnet):</td>
                <td>{membershipData.inscrito_por}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Entradas:</td>
                <td>{membershipData.entradas}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Tipo:</td>
                <td>{membershipData.tipo}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Añadido en:</td>
                <td>{formatDateTime(membershipData.created_at)}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Actualizado en:</td>
                <td>{formatDateTime(membershipData.updated_at)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


