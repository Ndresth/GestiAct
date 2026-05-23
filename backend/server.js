require("dotenv").config();
const express = require("express");
const cors = require("cors");

const activosRoutes = require("./routes/activos");
const usuariosRoutes = require("./routes/usuarios");
const categoriasRoutes = require("./routes/categorias");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// CORS flexible para evitar errores de bloqueo
app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones desde tu dominio de Netlify y también desarrollo local
    if (!origin || origin.includes("gestiact.netlify.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/activos", activosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});