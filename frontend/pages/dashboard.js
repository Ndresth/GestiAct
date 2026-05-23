import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import DashboardCard from "../components/DashboardCard";
import GraficaCategorias from "../components/GraficaCategorias";

export default function Dashboard() {
  const [datos, setDatos] = useState({ totalActivos: 0, totalUsuarios: 0 });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`);
        const json = await res.json();
        setDatos(json);
      } catch (err) {
        console.error("Error al cargar dashboard", err);
      }
    };
    fetchDatos();
  }, []);

  return (
    <AuthGuard>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard titulo="Total Activos" valor={datos.totalActivos} />
              <DashboardCard titulo="Total Usuarios" valor={datos.totalUsuarios} />
            </div>
            <div className="mt-8">
              <GraficaCategorias />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}