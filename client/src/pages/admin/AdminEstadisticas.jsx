import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/appLayout/AppLayout";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import {
  getSolicitudesPorAmbiente,
  getSolicitudesPorMes,
} from "../../services/estadisticas.services";
import { ClipLoader } from "react-spinners";
import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";

// Registra los elementos que necesitas
Chart.register(
  ArcElement, // Necesario para gráficos de tipo doughnut o pie
  BarElement, // Necesario para gráficos de barras
  LineElement, // Necesario para gráficos de líneas
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminEstadisticas() {
  const [ambientesData, setAmbientesData] = useState(null);
  const [mesesData, setMesesData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loadingAmbientes, setLoadingAmbientes] = useState(true); // Estado de carga para ambientes
  const [loadingMeses, setLoadingMeses] = useState(true); // Estado de carga para meses
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener los datos de solicitudes por ambiente
  useEffect(() => {
    async function fetchAmbientesData() {
      try {
        setLoadingAmbientes(true);
        const data = await getSolicitudesPorAmbiente(year);
        setAmbientesData(data);
      } catch (err) {
        setError("Error al cargar los datos de solicitudes por ambiente.");
      } finally {
        setLoadingAmbientes(false);
      }
    }
    fetchAmbientesData();
  }, [year]);

  // Obtener los datos de solicitudes por mes
  useEffect(() => {
    async function fetchMesesData() {
      try {
        setLoadingMeses(true);
        const data = await getSolicitudesPorMes(year);
        setMesesData(data);
      } catch (err) {
        setError("Error al cargar los datos de solicitudes por mes.");
      } finally {
        setLoadingMeses(false);
      }
    }
    fetchMesesData();
  }, [year]);

  const ambientesChartData = {
    labels: ambientesData ? ambientesData.data.map((item) => item.nombre) : [],
    datasets: [
      {
        label: `Solicitudes por Ambiente (${year})`,
        data: ambientesData
          ? ambientesData.data.map((item) => item.cantidad)
          : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const mesesChartData = {
    labels: mesesData ? mesesData.data.map((item) => `Mes ${item._id}`) : [],
    datasets: [
      {
        label: `Solicitudes por Mes (${year})`,
        data: mesesData ? mesesData.data.map((item) => item.cantidad) : [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <AppLayout>
      <AdminLayout>
        <div className="flex items-center flex-col">
          <h1 className="my-8 text-lg font-semibold">
            Estadísticas de Solicitudes
          </h1>
          <div className="flex justify-center items-center gap-12">
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold">Estadisticas por año</h2>
              <label htmlFor="yearSelect">Seleccione el año:</label>
              <select
                id="yearSelect"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>

              <div style={{ width: "600px", margin: "0 auto" }}>
                {loadingAmbientes ? (
                  <ClipLoader
                    size={50}
                    color={"#123abc"}
                    loading={loadingAmbientes}
                  />
                ) : ambientesData ? (
                  <Pie data={ambientesChartData} />
                ) : (
                  <p>
                    {error ||
                      "No se encontraron datos de solicitudes por ambiente."}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold">Estadisticas por mes</h2>

              <div
                style={{ width: "600px", margin: "0 auto", marginTop: "50px" }}
              >
                {loadingMeses ? (
                  <ClipLoader
                    size={50}
                    color={"#123abc"}
                    loading={loadingMeses}
                  />
                ) : mesesData ? (
                  <Bar data={mesesChartData} />
                ) : (
                  <p>
                    {error || "No se encontraron datos de solicitudes por mes."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AppLayout>
  );
}
