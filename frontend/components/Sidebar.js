import Link from "next/link";

export default function Sidebar() {

  return (

    <aside className="
      w-64
      bg-gray-900
      text-white
      min-h-screen
      p-6
    ">

      <h2 className="
        text-2xl
        font-bold
        mb-8
      ">
        Menú
      </h2>



      <nav className="
        flex
        flex-col
        gap-4
      ">

        <Link
          href="/"
          className="
            hover:bg-gray-700
            p-3
            rounded-lg
            transition
          "
        >
          Dashboard
        </Link>



        <Link
          href="/activos"
          className="
            hover:bg-gray-700
            p-3
            rounded-lg
            transition
          "
        >
          Activos
        </Link>



        <Link
          href="/usuarios"
          className="
            hover:bg-gray-700
            p-3
            rounded-lg
            transition
          "
        >
          Usuarios
        </Link>



        <Link
          href="/categorias"
          className="
            hover:bg-gray-700
            p-3
            rounded-lg
            transition
          "
        >
          Categorías
        </Link>

      </nav>

    </aside>

  );

}