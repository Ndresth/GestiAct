require("dotenv").config();

const express = require("express");
const cors = require("cors");

const activosRoutes = require("./routes/activos");

const app = express();

const usuariosRoutes =
require("./routes/usuarios");

const categoriasRoutes =
require("./routes/categorias");

const dashboardRoutes =
require("./routes/dashboard");

app.use(cors());
app.use(express.json());

app.use("/api/activos", activosRoutes);

app.use("/api/usuarios", usuariosRoutes);

app.use("/api/categorias", categoriasRoutes);

app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});