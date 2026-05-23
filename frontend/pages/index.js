import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import DashboardCard from "../components/DashboardCard";
import GraficaCategorias from "../components/GraficaCategorias";

export default function Home() {
  const [stats, setStats] = useState({
    totalActivos: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    let montado = true;

    const cargarDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`);
        const data = await res.json();
        
        if (montado) {
          setStats({
            totalActivos: data.totalActivos || 0,
            totalUsuarios: data.totalUsuarios || 0,
            totalCategorias: data.totalCategorias || 0,
          });
        }
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    cargarDashboard();

    return () => {
      montado = false;
    };
  }, [API_URL]);

  return (
    <AuthGuard>
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard 
                titulo="Total Activos" 
                valor={stats.totalActivos} 
                tipo="activos" 
              />
              <DashboardCard 
                titulo="Total Categorías" 
                valor={stats.totalCategorias} 
                tipo="categorias" 
              />
              <DashboardCard 
                titulo="Total Usuarios" 
                valor={stats.totalUsuarios} 
                tipo="usuarios" 
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Distribución por Categorías</h2>
              <div className="h-64">
                <GraficaCategorias />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}