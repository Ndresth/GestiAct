require("dotenv").config();

const express = require("express");
const cors = require("cors");

const activosRoutes = require("./routes/activos");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/activos", activosRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});