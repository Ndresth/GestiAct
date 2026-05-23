import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  
  const [actualizador, setActualizador] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ mensaje: "", tipo: "" });
    }, 3000);
  };

  const recargarTabla = () => {
    setActualizador((prev) => prev + 1);
  };

  useEffect(() => {
    let montado = true;

    const cargarCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categorias`);
        const data = await res.json();
        
        if (montado) {
          setCategorias(data);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    cargarCategorias();

    return () => {
      montado = false;
    };
  }, [API_URL, actualizador]);

  const guardarCategoria = async (e) => {
    e.preventDefault();

    const categoria = {
      nombre,
      descripcion,
    };

    try {
      if (editandoId) {
        await fetch(`${API_URL}/api/categorias/${editandoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoria),
        });
        mostrarNotificacion("Categoría actualizada correctamente.", "exito");
      } else {
        await fetch(`${API_URL}/api/categorias`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoria),
        });
        mostrarNotificacion("Categoría creada correctamente.", "exito");
      }

      limpiarFormulario();
      recargarTabla();
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Ocurrió un error al procesar la solicitud.", "error");
    }
  };

  const editarCategoria = (cat) => {
    setNombre(cat.nombre || "");
    setDescripcion(cat.descripcion || "");
    setEditandoId(cat.id);
  };

  const solicitarEliminacion = (id) => {
    setCategoriaAEliminar(id);
  };

  const cancelarEliminacion = () => {
    setCategoriaAEliminar(null);
  };

  const confirmarEliminacion = async () => {
    try {
      await fetch(`${API_URL}/api/categorias/${categoriaAEliminar}`, {
        method: "DELETE",
      });
      mostrarNotificacion("Categoría eliminada correctamente.", "exito");
      setCategoriaAEliminar(null);
      recargarTabla();
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al eliminar la categoría.", "error");
      setCategoriaAEliminar(null);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setEditandoId(null);
  };

  return (
    <AuthGuard>
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1>

            {notificacion.mensaje && (
              <div
                className={`mb-4 p-4 rounded-lg font-medium text-white ${
                  notificacion.tipo === "exito" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {notificacion.mensaje}
              </div>
            )}

            {categoriaAEliminar && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-red-800 font-semibold">
                  ¿Está seguro de que desea eliminar esta categoría de forma permanente?
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

            <form
              onSubmit={guardarCategoria}
              className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors"
              >
                {editandoId ? "Actualizar" : "Guardar"}
              </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
              <table className="w-full border border-collapse text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-3">Nombre</th>
                    <th className="border p-3">Descripción</th>
                    <th className="border p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-3">{c.nombre}</td>
                      <td className="border p-3">{c.descripcion}</td>
                      <td className="border p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editarCategoria(c)}
                            type="button"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            Editar
                          </button>
                          <button
                            onClick={() => solicitarEliminacion(c.id)}
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