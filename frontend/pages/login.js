import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setMensaje("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) {
      setMensaje("Contraseña o correo incorrectos");
      return;
    }

    if (data.user) {
      setMensaje("Acceso autorizado. Redirigiendo...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={iniciarSesion}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Entrar
        </button>

        {mensaje && (
          <p className={`mt-4 text-center font-semibold ${mensaje.includes('incorrectos') ? 'text-red-600' : 'text-green-600'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}