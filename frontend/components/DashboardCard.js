export default function DashboardCard({

  titulo,
  valor

}) {

  return (

    <div className="
      bg-white
      p-6
      rounded-2xl
      shadow-lg
      border-l-8
      border-blue-500
      hover:scale-105
      transition
    ">

      <h2 className="
        text-gray-500
        text-lg
      ">
        {titulo}
      </h2>

      <p className="
        text-5xl
        font-bold
        mt-4
        text-blue-600
      ">
        {valor}
      </p>

    </div>

  );

}