import {

  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend

} from "chart.js";

import { Pie }
from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function GraficaCategorias({

  categorias

}) {

  const data = {

    labels:
      categorias.map(
        (c) => c.categoria
      ),

    datasets: [

      {

        label: "Activos",

        data:
          categorias.map(
            (c) => c.total
          ),

        backgroundColor: [

          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6"

        ]

      }

    ]

  };



  return (

    <div className="
      bg-white
      p-6
      rounded-xl
      shadow-md
    ">

      <h2 className="
        text-xl
        font-bold
        mb-4
      ">
        Activos por Categoría
      </h2>

      <Pie data={data} />

    </div>

  );

}