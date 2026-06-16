import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axiosInstance from "../utils/AxiosInstance";
import * as XLSX from "xlsx";

// Register required Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ChartsPage = () => {
  const [membershipData, setMembershipData] = useState([]);
  const [timeRange, setTimeRange] = useState("Hoy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({ dateA: "", dateB: "" });
const [customDateData, setCustomDateData] = useState([]);
const [customLoading, setCustomLoading] = useState(false);
const [customError, setCustomError] = useState(null);

const [attendanceData, setAttendanceData] = useState([]);
const [attendanceFilteredData, setAttendanceFilteredData] = useState([]);
const [attendanceTimeRange, setAttendanceTimeRange] = useState("Hoy");

const [attendanceCustomRange, setAttendanceCustomRange] = useState({
  dateA: "",
  dateB: "",
});

const [attendanceCustomData, setAttendanceCustomData] = useState([]);

const [ciCliente, setCiCliente] = useState(null);
const [clientData, setClientData] = useState(null);



  useEffect(() => {
    fetchMembershipData();
  }, [timeRange]);

  useEffect(() => {
    fetchAttendanceData();
  }, []);
  
  useEffect(() => {
    filterAttendanceData(attendanceData, attendanceTimeRange);
  }, [attendanceTimeRange, attendanceData]);
  

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/reports/membershipsReport");
      setMembershipData(response.data.data);
      setError(null);
    } catch (err) {
      setError("Error fetching membership data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axiosInstance.get("/reports/attendancesReport");
      const allData = response.data.data;
      setAttendanceData(allData);
      filterAttendanceData(allData, "Hoy"); // Default filter
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };
  
  
  const filterAttendanceData = (data, timeRange) => {
    const filtered = data.find((item) => item.periodo === timeRange);
    setAttendanceFilteredData(filtered ? [filtered] : []);
  };
  

  // Find the data for the selected time range
  const selectedData = membershipData.find((item) => item.periodo === timeRange) || {
    nuevas_membresias: "0",
    ingresos_totales: "0",
    membresias_vencidas: "0",
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({ ...prev, [name]: value }));
  };
  
  const fetchCustomDateRangeData = async () => {
    try {
      setCustomLoading(true);
      const response = await axiosInstance.post("/reports/membershipsBayDateReport", customDateRange);
      setCustomDateData(response.data.data);
      setCustomError(null);
    } catch (err) {
      setCustomError("Error fetching data for the custom date range.");
    } finally {
      setCustomLoading(false);
    }
  };

  const attendanceCustomTotalData = {
    labels: attendanceCustomData.map((item) => new Date(item.fecha).toLocaleDateString("es-ES")),
    datasets: [
      {
        label: "Asistencias Totales",
        data: attendanceCustomData.map((item) => parseInt(item.asistencias_totales, 10)),
        backgroundColor: "#3B82F6",
      },
    ],
  };
  
  const attendanceCustomClientsData = {
    labels: attendanceCustomData.map((item) => new Date(item.fecha).toLocaleDateString("es-ES")),
    datasets: [
      {
        label: "Clientes Únicos",
        data: attendanceCustomData.map((item) => parseInt(item.clientes, 10)),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const fetchCustomAttendanceData = async () => {
    if (!attendanceCustomRange.dateA || !attendanceCustomRange.dateB) {
      alert("Por favor, selecciona ambas fechas.");
      return;
    }
  
    try {
      const response = await axiosInstance.post("/reports/attendancesByDateReport", {
        dateA: attendanceCustomRange.dateA,
        dateB: attendanceCustomRange.dateB,
      });
      setAttendanceCustomData(response.data.data);
    } catch (error) {
      console.error("Error al obtener el reporte de asistencias:", error);
      alert("Hubo un error al obtener el reporte.");
    }
  };

  const fetchClientData = async (value) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/reports/clientReport/${value}`);
      setClientData(response.data.data[0]);
      console.log(response.data.data);
    } catch (err) {
      setError("Failed to fetch client data");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  


  const generateExcel = async () => {

    if (
      customDateRange.dateA === "" ||
      attendanceCustomRange.dateA === "" ||
      customDateRange.dateB === "" ||
      attendanceCustomRange.dateB === "" ||
      (clientData === undefined || clientData === null)
    ) {
      alert("Porfavor seleccione todos los rangos de fecha y un carnet valido para generar el archivo.");
      return;
    }
  
    try {
      // Fetch data from all five APIs
      const [
        membershipsReport,
        attendancesReport,
        membershipsByDateReport,
        attendancesByDateReport,
        clientReport
      ] = await Promise.all([
        axiosInstance.get("/reports/membershipsReport"),
        axiosInstance.get("/reports/attendancesReport"),
        axiosInstance.post("/reports/membershipsBayDateReport", customDateRange),
        axiosInstance.post("/reports/attendancesByDateReport", {
          dateA: attendanceCustomRange.dateA,
          dateB: attendanceCustomRange.dateB,
        }),
        axiosInstance.get(`/reports/clientReport/${ciCliente}`) // Replace `ciCliente` with the actual value if hardcoded
      ]);
  
      // Create a workbook
      const workbook = XLSX.utils.book_new();
  
      // Prepare data for each report
      const membershipsData = [
        ["Periodo", "Nuevas Membresías", "Ingresos Totales", "Membresías Vencidas"],
        ...membershipsReport.data.data.map((item) => [
          item.periodo,
          item.nuevas_membresias,
          item.ingresos_totales,
          item.membresias_vencidas,
        ]),
      ];
  
      const attendancesData = [
        ["Periodo", "Asistencias Totales", "Clientes Únicos"],
        ...attendancesReport.data.data.map((item) => [
          item.periodo,
          item.asistencias_totales,
          item.clientes,
        ]),
      ];
  
      const membershipsByDateData = [
        ["Fecha", "Nuevas Membresías", "Ingresos Totales", "Membresías Vencidas"],
        ...membershipsByDateReport.data.data.map((item) => [
          new Date(item.fecha).toLocaleDateString("es-ES"),
          item.nuevas_membresias,
          item.ingresos_totales,
          item.membresias_vencidas,
        ]),
      ];
  
      const attendancesByDateData = [
        ["Fecha", "Asistencias Totales", "Clientes Únicos"],
        ...attendancesByDateReport.data.data.map((item) => [
          new Date(item.fecha).toLocaleDateString("es-ES"),
          item.asistencias_totales,
          item.clientes,
        ]),
      ];
  
      const clientData = [
        ["CI", "Nombre", "Total Membresías", "Total Gastado", "Primera Membresía", "Última Membresía"],
        [
          clientReport.data.data[0].carnet_identidad,
          clientReport.data.data[0].nombre_cliente,
          clientReport.data.data[0].total_membresias,
          clientReport.data.data[0].total_gastado,
          new Date(clientReport.data.data[0].primera_membresia).toLocaleDateString("es-ES"),
          new Date(clientReport.data.data[0].ultima_membresia).toLocaleDateString("es-ES"),
        ],
      ];
  
      // Add sheets to the workbook
      const membershipsSheet = XLSX.utils.aoa_to_sheet(membershipsData);
      XLSX.utils.book_append_sheet(workbook, membershipsSheet, "Reporte de Membresias");
  
      const attendancesSheet = XLSX.utils.aoa_to_sheet(attendancesData);
      XLSX.utils.book_append_sheet(workbook, attendancesSheet, "Reporte de Asistencias");
  
      const membershipsByDateSheet = XLSX.utils.aoa_to_sheet(membershipsByDateData);
      XLSX.utils.book_append_sheet(workbook, membershipsByDateSheet, "Membresias por Fechas");
  
      const attendancesByDateSheet = XLSX.utils.aoa_to_sheet(attendancesByDateData);
      XLSX.utils.book_append_sheet(workbook, attendancesByDateSheet, "Asistencias por Fechas");
  
      const clientSheet = XLSX.utils.aoa_to_sheet(clientData);
      XLSX.utils.book_append_sheet(workbook, clientSheet, "Reporte de Cliente");
  
      // Generate and download the Excel file
      XLSX.writeFile(workbook, "Reporte_Gym_Mania.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };
  
  
  
  
  

  return (
    <div className="min-h-screen bg-gymmania-black p-8">
      <BackButton />
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>
        <div className="flex justify-end mb-4">
          <select
            className="border px-4 py-2 rounded-lg"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Hoy">Hoy</option>
            <option value="Esta Semana">Esta Semana</option>
            <option value="Este Mes">Este Mes</option>
            <option value="Este Año">Este Año</option>
          </select>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-blue-100 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-bold">Nuevas Membresías</h2>
                <p className="text-2xl font-semibold">{selectedData.nuevas_membresias}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-bold">Ingresos Totales</h2>
                <p className="text-2xl font-semibold">{selectedData.ingresos_totales}</p>
              </div>
              <div className="p-4 bg-red-100 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-bold">Membresías Vencidas</h2>
                <p className="text-2xl font-semibold">{selectedData.membresias_vencidas}</p>
              </div>
            </div>
          </>
        )}
      </div>


      <div className="max-w-7xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reporte por Rango de Fechas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="dateA" className="block font-bold mb-2">Fecha Inicio:</label>
            <input
              type="date"
              id="dateA"
              name="dateA"
              value={customDateRange.dateA}
              onChange={handleDateChange}
              className="border px-4 py-2 rounded-lg w-1/2"
            />
          </div>
          <div>
            <label htmlFor="dateB" className="block font-bold mb-2">Fecha Fin:</label>
            <input
              type="date"
              id="dateB"
              name="dateB"
              value={customDateRange.dateB}
              onChange={handleDateChange}
              className="border px-4 py-2 rounded-lg w-1/2"
            />
          </div>
        </div>
        <button
          onClick={fetchCustomDateRangeData}
          className="bg-gymmania-orange text-white px-4 py-2 rounded-lg hover:bg-gymmania-orange-dark transition duration-200"
        >
          Generar Reporte
        </button>

        {customLoading ? (
          <p className="mt-6">Cargando datos...</p>
        ) : customError ? (
          <p className="mt-6 text-red-500">{customError}</p>
        ) : customDateData.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Resultados del Rango Seleccionado</h3>
            <Bar
              data={{
                labels: customDateData.map((item) => new Date(item.fecha).toLocaleDateString("es-ES")),
                datasets: [
                  {
                    label: "Nuevas Membresías",
                    data: customDateData.map((item) => parseInt(item.nuevas_membresias, 10)),
                    backgroundColor: "#4CAF50",
                  },
                  {
                    label: "Ingresos Totales",
                    data: customDateData.map((item) => parseFloat(item.ingresos_totales)),
                    backgroundColor: "#3B82F6",
                  },
                  {
                    label: "Membresías Vencidas",
                    data: customDateData.map((item) => parseInt(item.membresias_vencidas, 10)),
                    backgroundColor: "#FF9800",
                  },
                ],
              }}
            />
          </div>
        ) : (
          <p className="mt-6">No hay datos disponibles para este rango de fechas.</p>
        )}
      </div>


 {/* Asistencias */}
 <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
 <div className="mb-8">
  <h2 className="text-2xl font-bold mb-4">Reporte de Asistencias</h2>
  <div className="flex justify-end mb-4">
    <select
      className="border px-4 py-2 rounded-lg"
      value={attendanceTimeRange}
      onChange={(e) => setAttendanceTimeRange(e.target.value)}
    >
      <option value="Hoy">Hoy</option>
      <option value="Esta Semana">Esta Semana</option>
      <option value="Este Mes">Este Mes</option>
      <option value="Este Año">Este Año</option>
    </select>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {attendanceFilteredData.map((item, index) => (
      <div key={`attendance-${index}`} className="p-4 bg-blue-100 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-bold">{item.periodo} - Asistencias Totales</h3>
        <p className="text-2xl font-semibold text-blue-800">{item.asistencias_totales}</p>
      </div>
    ))}
    {attendanceFilteredData.map((item, index) => (
      <div key={`clients-${index}`} className="p-4 bg-green-100 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-bold">{item.periodo} - Clientes Únicos</h3>
        <p className="text-2xl font-semibold text-green-700">{item.clientes}</p>
      </div>
    ))}
  </div>
</div>
</div>

{/* Asistencias por rango*/}

<div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
<div className="mb-8">
  <h2 className="text-2xl font-bold mb-4">Asistencias por Rango de Fecha</h2>
  <div className="flex justify-between mb-4">
    <div className="flex gap-4">
      <input
        type="date"
        className="border px-4 py-2 rounded-lg"
        value={attendanceCustomRange.dateA}
        onChange={(e) => setAttendanceCustomRange({ ...attendanceCustomRange, dateA: e.target.value })}
      />
      <input
        type="date"
        className="border px-4 py-2 rounded-lg"
        value={attendanceCustomRange.dateB}
        onChange={(e) => setAttendanceCustomRange({ ...attendanceCustomRange, dateB: e.target.value })}
      />
    </div>
    <button
      className="bg-gymmania-orange text-white hover:bg-gymmania-orange-dark px-4 py-2 rounded-lg"
      onClick={fetchCustomAttendanceData}
    >
      Generar Reporte
    </button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Asistencias Totales</h3>
      <Bar data={attendanceCustomTotalData} />
    </div>
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Clientes Únicos</h3>
      <Bar data={attendanceCustomClientsData} />
    </div>
  </div>
</div>
</div>


{/*clientes */}

<div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
  <h1 className="text-2xl font-bold mb-4">Reporte por Cliente</h1>

  {/* Input to search client by CI */}
  <div className="flex items-center gap-4 mb-6">
    <input
      type="text"
      placeholder="Ingrese el CI del cliente"
      value={ciCliente}
      onChange={(e) => setCiCliente(e.target.value)}
      className="flex-1 border px-4 py-2 rounded-lg w-1/2"
    />
    <button
      onClick={() => fetchClientData(ciCliente)}
      className="px-4 py-2 bg-gymmania-orange text-white rounded-lg"
    >
      Buscar Cliente
    </button>
  </div>

  {/* Loading State */}
  {loading && <p className="text-blue-500">Cargando datos...</p>}

  {/* Error State */}
  {error && <p className="text-red-500">{error}</p>}

  {/* Client Report */}
  {clientData && (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Reporte por Cliente</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p><span className="font-bold">CI:</span> {clientData.carnet_identidad}</p>
        <p><span className="font-bold">Nombre:</span> {clientData.nombre_cliente}</p>
        <p><span className="font-bold">Total Membresías:</span> {clientData.total_membresias}</p>
        <p><span className="font-bold">Total Gastado:</span> {clientData.total_gastado}</p>
        <p><span className="font-bold">Primera Membresía:</span> {formatDateTime(clientData.primera_membresia)}</p>
        <p><span className="font-bold">Última Membresía:</span> {formatDateTime(clientData.ultima_membresia)}</p>
      </div>
    </div>
  )}
</div>




<div className="flex justify-center items-center mt-6">
  <button
    onClick={generateExcel}
    className="bg-gymmania-orange text-white px-8 py-4 text-lg font-jaro rounded hover:bg-gymmania-orange-dark"
  >
    Generar Reporte en Excel
  </button>
</div>



    </div>
  );
};

export default ChartsPage;
