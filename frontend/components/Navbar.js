import { useRouter }
from "next/router";

import { supabase }
from "../lib/supabase";

export default function Navbar() {

  const router = useRouter();




  const cerrarSesion =
    async () => {

      await supabase.auth.signOut();

      router.push("/login");

    };




  return (

    <nav className="
      bg-gradient-to-r
      from-blue-700
      to-blue-500
      text-white
      p-4
      shadow-lg
      flex
      justify-between
      items-center
    ">

      <div>

        <h1 className="
          text-2xl
          font-bold
        ">
          GestiAct
        </h1>

        <p className="
          text-sm
          opacity-80
        ">
          Sistema de Gestión de Activos
        </p>

      </div>



      <button
        onClick={cerrarSesion}
        className="
          bg-red-500
          hover:bg-red-600
          px-4
          py-2
          rounded-lg
          transition
        "
      >
        Cerrar sesión
      </button>

    </nav>

  );

}