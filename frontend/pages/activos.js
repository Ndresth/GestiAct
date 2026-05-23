import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

export default function Activos() {
  const [activos, setActivos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre: "", serial: "", categoria: "", marca: "", modelo: "", ubicacion: "" });
  const [editando, setEditando] = useState(false);
  const [activoId, setActivoId] = useState(null);
  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });
  const [actualizador, setActualizador] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion({ mensaje: "", tipo: "" }), 3000);
  };

  const recargarTabla = () => setActualizador((prev) => prev + 1);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [resActivos, resCategorias] = await Promise.all([
          fetch(`${API_URL}/api/activos`),
          fetch(`${API_URL}/api/categorias`)
        ]);
        const dataActivos = await resActivos.json();
        const dataCategorias = await resCategorias.json();
        setActivos(Array.isArray(dataActivos) ? dataActivos : []);
        setCategorias(Array.isArray(dataCategorias) ? dataCategorias : []);
      } catch (error) {
        console.error("Error al cargar:", error);
      }
    };
    obtenerDatos();
  }, [API_URL, actualizador]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editando ? `${API_URL}/api/activos/${activoId}` : `${API_URL}/api/activos`;
      await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      mostrarNotificacion(editando ? "Actualizado correctamente." : "Creado correctamente.", "exito");
      setForm({ nombre: "", serial: "", categoria: "", marca: "", modelo: "", ubicacion: "" });
      setEditando(false);
      setActivoId(null);
      recargarTabla();
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al procesar la solicitud.", "error");
    }
  };

  const eliminarActivo = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este activo?")) return;
    try {
      await fetch(`${API_URL}/api/activos/${id}`, { method: "DELETE" });
      mostrarNotificacion("Activo eliminado.", "exito");
      recargarTabla();
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al eliminar.", "error");
    }
  };

  const editarActivo = (activo) => {
    setEditando(true);
    setActivoId(activo.id);
    setForm({ nombre: activo.nombre, serial: activo.serial, categoria: activo.categoria, marca: activo.marca, modelo: activo.modelo, ubicacion: activo.ubicacion });
  };

  return (
    <AuthGuard>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Gestión de Activos</h1>
          
          {notificacion.mensaje && (
            <div className={`mb-4 p-4 rounded-lg text-white ${notificacion.tipo === "exito" ? "bg-green-600" : "bg-red-600"}`}>
              {notificacion.mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border p-3 rounded-lg" required />
              <input name="serial" placeholder="Serial" value={form.serial} onChange={handleChange} className="border p-3 rounded-lg" required />
              <select name="categoria" value={form.categoria} onChange={handleChange} className="border p-3 rounded-lg" required>
                <option value="">Categoría</option>
                {categorias?.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
              <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} className="border p-3 rounded-lg" required />
              <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} className="border p-3 rounded-lg" required />
              <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} className="border p-3 rounded-lg" required />
            </div>
            <button type="submit" className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
              {editando ? "Actualizar" : "Guardar Activo"}
            </button>
          </form>

          <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
            <table className="w-full border text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Serial</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Marca</th>
                  <th className="p-3">Modelo</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {activos?.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-3">{a.nombre}</td>
                    <td className="p-3">{a.serial}</td>
                    <td className="p-3">{a.categoria}</td>
                    <td className="p-3">{a.marca}</td>
                    <td className="p-3">{a.modelo}</td>
                    <td className="p-3">{a.ubicacion}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => editarActivo(a)} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
                      <button onClick={() => eliminarActivo(a.id)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}