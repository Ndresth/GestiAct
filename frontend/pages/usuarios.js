import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import AuthGuard from "../components/AuthGuard";

export default function Usuarios() {

  const [usuarios, setUsuarios] =
    useState([]);

  const [nombre, setNombre] =
    useState("");

  const [correo, setCorreo] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rol, setRol] =
    useState("Usuario");

  const [editandoId, setEditandoId] =
    useState(null);




  const cargarUsuarios =
    async () => {

      const res =
        await fetch(
          "http://localhost:4000/api/usuarios"
        );

      const data =
        await res.json();

      setTimeout(() => {

        setUsuarios(data);

      }, 0);

    };




  useEffect(() => {

    cargarUsuarios();

  }, []);




  const guardarUsuario =
    async (e) => {

      e.preventDefault();




      const usuario = {

        nombre,
        correo,
        password,
        rol

      };




      if (editandoId) {

        const verificarPassword =
          prompt(
            "Ingrese contraseña administrador"
          );




        if (!verificarPassword) {

          return;

        }




        const verificar =
          await fetch(
            "http://localhost:4000/api/usuarios/verificar-admin",
            {

              method: "POST",

              headers: {
                "Content-Type":
                "application/json"
              },

              body: JSON.stringify({

                password:
                verificarPassword

              })

            }
          );




        const resultado =
          await verificar.json();




        if (!resultado.ok) {

          alert(
            "Contraseña incorrecta"
          );

          return;

        }




        await fetch(
          `http://localhost:4000/api/usuarios/${editandoId}`,
          {

            method: "PUT",

            headers: {
              "Content-Type":
              "application/json"
            },

            body: JSON.stringify(usuario)

          }
        );

      } else {

        await fetch(
          "http://localhost:4000/api/usuarios",
          {

            method: "POST",

            headers: {
              "Content-Type":
              "application/json"
            },

            body: JSON.stringify(usuario)

          }
        );

      }




      limpiarFormulario();

      cargarUsuarios();

    };




  const editarUsuario =
    (usuario) => {

      setNombre(usuario.nombre);

      setCorreo(usuario.correo);

      setPassword(usuario.password);

      setRol(usuario.rol);

      setEditandoId(usuario.id);

    };




  const eliminarUsuario =
    async (id) => {

      const password =
        prompt(
          "Ingrese contraseña administrador"
        );




      if (!password) {

        return;

      }




      const verificar =
        await fetch(
          "http://localhost:4000/api/usuarios/verificar-admin",
          {

            method: "POST",

            headers: {
              "Content-Type":
              "application/json"
            },

            body: JSON.stringify({
              password
            })

          }
        );




      const resultado =
        await verificar.json();




      if (!resultado.ok) {

        alert(
          "Contraseña incorrecta"
        );

        return;

      }




      const confirmar =
        confirm(
          "¿Eliminar usuario?"
        );




      if (!confirmar) {

        return;

      }




      await fetch(
        `http://localhost:4000/api/usuarios/${id}`,
        {

          method: "DELETE"

        }
      );




      cargarUsuarios();

    };




  const limpiarFormulario =
    () => {

      setNombre("");

      setCorreo("");

      setPassword("");

      setRol("Usuario");

      setEditandoId(null);

    };




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
              Gestión de Usuarios
            </h1>




            <form
              onSubmit={guardarUsuario}
              className="
                bg-white
                p-6
                rounded-xl
                shadow-md
                mb-8
                grid
                grid-cols-1
                md:grid-cols-5
                gap-4
              "
            >

              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-lg
                "
                required
              />




              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-lg
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
                  border
                  p-3
                  rounded-lg
                "
                required
              />




              <select
                value={rol}
                onChange={(e) =>
                  setRol(e.target.value)
                }
                className="
                  border
                  p-3
                  rounded-lg
                "
              >

                <option>
                  Usuario
                </option>

                <option>
                  Administrador
                </option>

              </select>




              <button
                type="submit"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  rounded-lg
                  p-3
                "
              >

                {editandoId
                  ? "Actualizar"
                  : "Guardar"}

              </button>

            </form>




            <div className="
              bg-white
              p-6
              rounded-xl
              shadow-md
              overflow-auto
            ">

              <table className="
                w-full
                border
              ">

                <thead className="
                  bg-gray-200
                ">

                  <tr>

                    <th className="border p-2">
                      Nombre
                    </th>

                    <th className="border p-2">
                      Correo
                    </th>

                    <th className="border p-2">
                      Rol
                    </th>

                    <th className="border p-2">
                      Acciones
                    </th>

                  </tr>

                </thead>




                <tbody>

                  {usuarios.map((u) => (

                    <tr key={u.id}>

                      <td className="border p-2">
                        {u.nombre}
                      </td>

                      <td className="border p-2">
                        {u.correo}
                      </td>

                      <td className="border p-2">
                        {u.rol}
                      </td>

                      <td className="
                        border
                        p-2
                        flex
                        gap-2
                      ">

                        <button
                          onClick={() =>
                            editarUsuario(u)
                          }
                          className="
                            bg-yellow-500
                            hover:bg-yellow-600
                            text-white
                            px-3
                            py-1
                            rounded
                          "
                        >
                          Editar
                        </button>




                        <button
                          onClick={() =>
                            eliminarUsuario(u.id)
                          }
                          className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-3
                            py-1
                            rounded
                          "
                        >
                          Eliminar
                        </button>

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