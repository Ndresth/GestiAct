import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

export default function Categorias() {
  const router = useRouter();

  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const cargarCategorias = useCallback(async () => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      router.push("/login");
      return;
    }

    const res = await fetch("http://localhost:4000/api/categorias");
    const data = await res.json();
    setCategorias(data);
  }, [router]);

  useEffect(() => {
    const fetchCategorias = async () => {
      await cargarCategorias();
    };

    fetchCategorias();
  }, [cargarCategorias]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();

    if (editandoId) {
      await fetch(`http://localhost:4000/api/categorias/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setEditandoId(null);
    } else {
      await fetch("http://localhost:4000/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    }

    setForm({
      nombre: "",
      descripcion: "",
    });

    cargarCategorias();
  };

  const eliminarCategoria = async (id) => {
    const confirmar = confirm("¿Eliminar categoría?");
    if (!confirmar) return;

    await fetch(`http://localhost:4000/api/categorias/${id}`, {
      method: "DELETE",
    });

    cargarCategorias();
  };

  const editarCategoria = (categoria) => {
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });

    setEditandoId(categoria.id);
  };

  return (
    <AuthGuard>
      <div>
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1>

            <form
              onSubmit={guardarCategoria}
              className="bg-white p-6 rounded-lg shadow-md mb-6 grid gap-4"
            >
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded"
              >
                {editandoId ? "Actualizar Categoría" : "Guardar Categoría"}
              </button>
            </form>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Descripción</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="p-3">{c.nombre}</td>
                      <td className="p-3">{c.descripcion}</td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button
                          onClick={() => editarCategoria(c)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => eliminarCategoria(c.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
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