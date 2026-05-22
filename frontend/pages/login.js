import { useState } from "react";

import { useRouter } from "next/router";

import { supabase }
from "../lib/supabase";

export default function Login() {

  const router =
    useRouter();

  const [correo, setCorreo] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");




  const iniciarSesion =
    async (e) => {

      e.preventDefault();

      setMensaje("");




      const {

        data,
        error

      } = await supabase.auth.signInWithPassword({

        email: correo,

        password: password

      });




      if (error) {

        setMensaje(
          "Contraseña incorrecta"
        );

        return;

      }




      if (data.user) {

        setMensaje(
          "Contraseña correcta"
        );




        setTimeout(() => {

          router.push("/");

        }, 1000);

      }

    };




  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <form
        onSubmit={iniciarSesion}
        className="
          bg-white
          p-8
          rounded-xl
          shadow-md
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-3xl
          font-bold
          mb-6
          text-center
        ">
          Iniciar Sesión
        </h1>




        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
          }
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
          required
        />




        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
          required
        />




        <button
          type="submit"
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-lg
          "
        >
          Entrar
        </button>




        {mensaje && (

          <p className="
            mt-4
            text-center
            font-semibold
          ">
            {mensaje}
          </p>

        )}

      </form>

    </div>

  );

}