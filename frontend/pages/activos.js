import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

export default function Activos() {
  const [activos, setActivos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    serial: "",
    categoria: "",
    marca: "",
    modelo: "",
    ubicacion: "",
  });

  const [editando, setEditando] = useState(false);
  const [activoId, setActivoId] = useState(null);

  const cargarActivos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/activos");
      const data = await res.json();

      setTimeout(() => {
        setActivos(data);
      }, 0);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/categorias");
      const data = await res.json();

      setTimeout(() => {
        setCategorias(data);
      }, 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      cargarActivos();
      cargarCategorias();
    }, 0);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await fetch(`http://localhost:4000/api/activos/${activoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        alert("Activo actualizado");
      } else {
        await fetch("http://localhost:4000/api/activos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        alert("Activo creado");
      }

      setForm({
        nombre: "",
        serial: "",
        categoria: "",
        marca: "",
        modelo: "",
        ubicacion: "",
      });

      setEditando(false);
      setActivoId(null);

      cargarActivos();
    } catch (error) {
      console.error(error);
    }
  };

  const editarActivo = (activo) => {
    setEditando(true);
    setActivoId(activo.id);

    setForm({
      nombre: activo.nombre || "",
      serial: activo.serial || "",
      categoria: activo.categoria || "",
      marca: activo.marca || "",
      modelo: activo.modelo || "",
      ubicacion: activo.ubicacion || "",
    });
  };

  const eliminarActivo = async (id) => {
    const confirmar = confirm("¿Eliminar activo?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:4000/api/activos/${id}`, {
        method: "DELETE",
      });

      alert("Activo eliminado");
      cargarActivos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthGuard>
      <div>
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Gestión de Activos</h1>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-md mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />

                <input
                  name="serial"
                  placeholder="Serial"
                  value={form.serial}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />

                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                >
                  <option value="">Seleccione categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>

                <input
                  name="marca"
                  placeholder="Marca"
                  value={form.marca}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />

                <input
                  name="modelo"
                  placeholder="Modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />

                <input
                  name="ubicacion"
                  placeholder="Ubicación"
                  value={form.ubicacion}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                {editando ? "Actualizar Activo" : "Guardar Activo"}
              </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
              <table className="w-full border border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-3">Nombre</th>
                    <th className="border p-3">Serial</th>
                    <th className="border p-3">Categoría</th>
                    <th className="border p-3">Marca</th>
                    <th className="border p-3">Modelo</th>
                    <th className="border p-3">Ubicación</th>
                    <th className="border p-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {activos.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-100">
                      <td className="border p-3">{a.nombre}</td>
                      <td className="border p-3">{a.serial}</td>
                      <td className="border p-3">{a.categoria}</td>
                      <td className="border p-3">{a.marca}</td>
                      <td className="border p-3">{a.modelo}</td>
                      <td className="border p-3">{a.ubicacion}</td>
                      <td className="border p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editarActivo(a)}
                            type="button"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarActivo(a.id)}
                            type="button"
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Eliminar
                          </button>
                        </div>
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