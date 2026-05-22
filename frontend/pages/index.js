import { useEffect, useState }
from "react";

import Navbar
from "../components/Navbar";

import Sidebar
from "../components/Sidebar";

import DashboardCard
from "../components/DashboardCard";

import GraficaCategorias
from "../components/GraficaCategorias";

import AuthGuard
from "../components/AuthGuard";

export default function Home() {

  const [stats, setStats] =
    useState({

      totalActivos: 0,
      totalUsuarios: 0,
      totalCategorias: 0,
      ultimosActivos: [],
      categorias: []

    });




  // ============================

  const cargarDashboard =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:4000/api/dashboard"
          );

        const data =
          await res.json();




        setTimeout(() => {

          setStats(data);

        }, 0);




      } catch (error) {

        console.log(error);

      }

    };




  // ============================

  useEffect(() => {

    setTimeout(() => {

      cargarDashboard();

    }, 0);

  }, []);




  return (

    <AuthGuard>

      <div>

        <Navbar />



        <div className="flex">

          <Sidebar />



          <main className="
            flex-1
            p-6
            bg-gray-100
            min-h-screen
          ">

            <h1 className="
              text-3xl
              font-bold
              mb-6
            ">
              Dashboard
            </h1>




            {/* CARDS */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
              mb-8
            ">

              <DashboardCard
                titulo="Total Activos"
                valor={stats.totalActivos}
              />



              <DashboardCard
                titulo="Usuarios"
                valor={stats.totalUsuarios}
              />



              <DashboardCard
                titulo="Categorías"
                valor={stats.totalCategorias}
              />

            </div>




            {/* GRAFICA */}

            <div className="mb-8">

              <GraficaCategorias
                categorias={stats.categorias}
              />

            </div>




            {/* TABLA */}

            <div className="
              bg-white
              p-6
              rounded-xl
              shadow-md
              overflow-x-auto
            ">

              <h2 className="
                text-xl
                font-bold
                mb-4
              ">
                Últimos Activos
              </h2>




              <table className="
                w-full
                border
                border-collapse
              ">

                <thead className="
                  bg-gray-200
                ">

                  <tr>

                    <th className="
                      border
                      p-3
                    ">
                      Nombre
                    </th>

                    <th className="
                      border
                      p-3
                    ">
                      Serial
                    </th>

                    <th className="
                      border
                      p-3
                    ">
                      Categoría
                    </th>

                  </tr>

                </thead>




                <tbody>

                  {stats.ultimosActivos.map((a) => (

                    <tr
                      key={a.id}
                      className="
                        hover:bg-gray-100
                      "
                    >

                      <td className="
                        border
                        p-3
                      ">
                        {a.nombre}
                      </td>

                      <td className="
                        border
                        p-3
                      ">
                        {a.serial}
                      </td>

                      <td className="
                        border
                        p-3
                      ">
                        {a.categoria}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </main>

        </div>

      </div>

    </AuthGuard>

  );

}