import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import DashboardCard from "../components/DashboardCard";
import GraficaCategorias from "../components/GraficaCategorias";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalActivos: 0, totalUsuarios: 0, totalCategorias: 0 });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      }
    };
    cargarDatos();
  }, [API_URL]);

  return (
    <AuthGuard>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashboardCard titulo="Activos" valor={stats.totalActivos} />
            <DashboardCard titulo="Categorías" valor={stats.totalCategorias} />
            <DashboardCard titulo="Usuarios" valor={stats.totalUsuarios} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <GraficaCategorias categorias={stats.categorias || []} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}