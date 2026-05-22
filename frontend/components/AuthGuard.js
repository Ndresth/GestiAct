import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { supabase } from "../lib/supabase";

export default function AuthGuard({
  children
}) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);




  useEffect(() => {

    const verificarSesion =
      async () => {

        const { data } =
          await supabase.auth.getSession();

        if (!data.session) {

          router.push("/login");

          return;

        }

        setTimeout(() => {

          setLoading(false);

        }, 0);

      };



    verificarSesion();

  }, [router]);




  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Cargando...

      </div>

    );

  }



  return children;

}