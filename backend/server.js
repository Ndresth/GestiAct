require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/activos", require("./routes/activos"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/dashboard", require("./routes/dashboard"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));