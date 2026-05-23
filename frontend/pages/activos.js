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
  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });
  const [activoAEliminar, setActivoAEliminar] = useState(null);

  // Estado disparador para recargar la tabla sin romper las reglas de ESLint
  const [actualizador, setActualizador] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ mensaje: "", tipo: "" });
    }, 3000);
  };

  // Función para incrementar el estado y forzar la ejecución del useEffect
  const recargarTabla = () => {
    setActualizador((prev) => prev + 1);
  };

  // Un solo useEffect que maneja la carga, cumpliendo exhaustivamente con las dependencias
  useEffect(() => {
    let montado = true;

    const obtenerDatos = async () => {
      try {
        const resActivos = await fetch(`${API_URL}/api/activos`);
        const dataActivos = await resActivos.json();

        const resCategorias = await fetch(`${API_URL}/api/categorias`);
        const dataCategorias = await resCategorias.json();

        if (montado) {
          setActivos(dataActivos);
          setCategorias(dataCategorias);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    obtenerDatos();

    return () => {
      montado = false;
    };
  }, [API_URL, actualizador]);

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
        await fetch(`${API_URL}/api/activos/${activoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        mostrarNotificacion("Activo actualizado correctamente.", "exito");
      } else {
        await fetch(`${API_URL}/api/activos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        mostrarNotificacion("Activo creado correctamente.", "exito");
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
      recargarTabla();
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Ocurrió un error al procesar la solicitud.", "error");
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

  const solicitarEliminacion = (id) => {
    setActivoAEliminar(id);
  };

  const confirmarEliminacion = async () => {
    try {
      await fetch(`${API_URL}/api/activos/${activoAEliminar}`, {
        method: "DELETE",
      });
      mostrarNotificacion("Activo eliminado correctamente.", "exito");
      setActivoAEliminar(null);
      recargarTabla();
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al eliminar el activo.", "error");
      setActivoAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setActivoAEliminar(null);
  };

  return (
    <AuthGuard>
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Gestión de Activos</h1>

            {notificacion.mensaje && (
              <div
                className={`mb-4 p-4 rounded-lg font-medium text-white ${
                  notificacion.tipo === "exito" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {notificacion.mensaje}
              </div>
            )}

            {activoAEliminar && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-red-800 font-semibold">
                  ¿Está seguro de que desea eliminar este activo de forma permanente?
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={cancelarEliminacion}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarEliminacion}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Confirmar Eliminación
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="serial"
                  placeholder="Serial"
                  value={form.serial}
                  onChange={handleChange}
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="modelo"
                  placeholder="Modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="ubicacion"
                  placeholder="Ubicación"
                  value={form.ubicacion}
                  onChange={handleChange}
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors w-full md:w-auto"
              >
                {editando ? "Actualizar Activo" : "Guardar Activo"}
              </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
              <table className="w-full border border-collapse text-left">
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
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
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
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            Editar
                          </button>
                          <button
                            onClick={() => solicitarEliminacion(a.id)}
                            type="button"
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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