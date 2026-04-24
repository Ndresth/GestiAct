import { useEffect, useState, useCallback } from "react";

export default function Activos() {
  const [activos, setActivos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    serial: "",
    categoria: "",
    marca: "",
    modelo: "",
    ubicacion: ""
  });
  const [editandoId, setEditandoId] = useState(null);

  const cargarActivos = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/activos");
      const data = await res.json();
      setActivos(data);
    } catch (error) {
      console.error("Error al cargar los activos:", error);
    }
  }, []); 

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarActivos();
  }, [cargarActivos]); 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarActivo = async (e) => {
    e.preventDefault();

    if (editandoId) {
      await fetch(`http://localhost:4000/api/activos/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      setEditandoId(null);
    } else {
      await fetch("http://localhost:4000/api/activos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    }

    setForm({
      nombre: "",
      serial: "",
      categoria: "",
      marca: "",
      modelo: "",
      ubicacion: ""
    });

    cargarActivos();
  };

  const eliminarActivo = async (id) => {
    await fetch(`http://localhost:4000/api/activos/${id}`, {
      method: "DELETE"
    });
    cargarActivos();
  };

  const editarActivo = (activo) => {
    setForm({
      nombre: activo.nombre,
      serial: activo.serial,
      categoria: activo.categoria,
      marca: activo.marca,
      modelo: activo.modelo,
      ubicacion: activo.ubicacion
    });
    setEditandoId(activo.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Gestión de Activos
      </h1>

      <form onSubmit={guardarActivo} className="grid grid-cols-2 gap-2 mb-6">
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="serial"
          placeholder="Serial"
          value={form.serial}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="categoria"
          placeholder="Categoria"
          value={form.categoria}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="marca"
          placeholder="Marca"
          value={form.marca}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="modelo"
          placeholder="Modelo"
          value={form.modelo}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="ubicacion"
          placeholder="Ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
          className="border p-2"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white p-2 hover:bg-blue-600 transition"
        >
          {editandoId ? "Actualizar Activo" : "Guardar Activo"}
        </button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Serial</th>
            <th className="border p-2">Categoria</th>
            <th className="border p-2">Ubicacion</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activos.map((a) => (
            <tr key={a.id}>
              <td className="border p-2 text-center">{a.nombre}</td>
              <td className="border p-2 text-center">{a.serial}</td>
              <td className="border p-2 text-center">{a.categoria}</td>
              <td className="border p-2 text-center">{a.ubicacion}</td>
              <td className="border p-2 space-x-2 flex justify-center">
                <button
                  onClick={() => editarActivo(a)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarActivo(a.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}