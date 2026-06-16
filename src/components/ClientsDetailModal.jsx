import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axiosInstance from "../utils/AxiosInstance";

export default function ClientsDetailsModal({ clientId, onClose }) {
  const [clientData, setClientData] = useState(null);
  const [clientPhoto, setClientPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axiosInstance.get(
          `/clients/getOne/${clientId}`
        );
        setClientData(response.data.data[0]); // Assuming `data` is an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Error al obtener datos del cliente.");
        setLoading(false);
      }
    };

    const fetchClientPhoto = async () => {
      try {
        const response = await axiosInstance.get(
          `/clients/${clientId}/photo`,
          { responseType: "blob" }
        );
        const photoUrl = URL.createObjectURL(response.data);
        setClientPhoto(photoUrl);
      } catch (err) {
        console.error("Error fetching client photo:", err);
        setClientPhoto(null);
      }
    };

    fetchClientData();
    fetchClientPhoto();
  }, [clientId]);

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());

    const formData = new FormData();
    formData.append("photo", blob);

    try {
      const response = await axiosInstance.post(
        `/clients/${clientId}/uploadPht`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message || "Foto subida exitosamente");
      //fetchClientPhoto(); // Refresh photo after successful upload
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Error al subir la foto.");
    }
  };

  if (loading) return <div className="p-4">Cargando datos del cliente...</div>;
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

  const useTryDay = async (ci) => {
    try {
        const response = await axiosInstance.put(`/clients/tryDay/${ci}`)
        alert(response.data.message);
    } catch (error) {
        alert(error.response?.data?.error);
    }
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
          {isTakingPhoto ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-48 h-48 rounded-full mb-4"
              />
              <button
                className="bg-gymmania-orange text-white px-4 py-2 rounded mt-2 hover:bg-gymmania-orange-dark"
                onClick={() => {
                  capturePhoto();
                  setIsTakingPhoto(false);
                }}
              >
                Capturar y Subir
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mt-2 hover:bg-gray-600"
                onClick={() => setIsTakingPhoto(false)}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark"
              onClick={() => setIsTakingPhoto(true)}
            >
              Tomar Foto
            </button>
          )}
        </div>

        {/* Client Info Section */}
        <div className="w-2/3 pl-6">
          <h2 className="text-2xl font-bold mb-4">Detalles del Cliente</h2>
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="font-bold pr-4 py-2">CI:</td>
                <td>{clientData.carnet_identidad}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Nombre:</td>
                <td>{clientData.nombre}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Apellido:</td>
                <td>{clientData.apellido}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Correo:</td>
                <td>{clientData.correo || "No disponible"}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Celular:</td>
                <td>{clientData.numero_celular}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Fecha de Nacimiento:</td>
                <td>
                    {clientData.fecha_nacimiento
                        ? new Date(clientData.fecha_nacimiento).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })
                        : ""}
                    </td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Género:</td>
                <td>{clientData.genero}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Contacto Emergencia:</td>
                <td>{clientData.persona_emergencia}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Teléfono Emergencia:</td>
                <td>{clientData.numero_emergencia}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Estado:</td>
                <td>{clientData.estado}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Dia de prueba usado:</td>
                <td>
                    {clientData.dia_prueba_usado ? "SI" : "NO"}
                    <button className="font-jaro bg-gymmania-orange text-white px-4 py-2 rounded shadow hover:bg-gymmania-orange-dark"
                            onClick={ () => useTryDay(clientData.carnet_identidad)}>
                        Utilizar
                    </button>
                
                </td>
                </tr>

              <tr>
                <td className="font-bold pr-4 py-2">Añadido en:</td>
                <td>{formatDateTime(clientData.created_at)}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4 py-2">Actualizado en:</td>
                <td>{formatDateTime(clientData.updated_at)}</td>
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


