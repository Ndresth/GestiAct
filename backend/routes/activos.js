const express = require("express");
const router = express.Router();

const supabase =
require("../supabaseClient");



router.get("/", async (req, res) => {

  const { data, error } =
    await supabase
      .from("activos")
      .select("*")
      .order("created_at", { ascending: false });

  if (error)
    return res.status(500).json(error);

  res.json(data);

});



router.post("/", async (req, res) => {

  const {
    nombre,
    serial,
    categoria,
    marca,
    modelo,
    ubicacion
  } = req.body;

  const { data, error } =
    await supabase
      .from("activos")
      .insert([
        {
          nombre,
          serial,
          categoria,
          marca,
          modelo,
          ubicacion
        }
      ])
      .select();

  if (error)
    return res.status(500).json(error);

  res.json(data);

});



router.put("/:id", async (req, res) => {

  const { id } = req.params;

  const {
    nombre,
    serial,
    categoria,
    marca,
    modelo,
    ubicacion
  } = req.body;

  const { data, error } =
    await supabase
      .from("activos")
      .update({
        nombre,
        serial,
        categoria,
        marca,
        modelo,
        ubicacion
      })
      .eq("id", id)
      .select();

  if (error)
    return res.status(500).json(error);

  res.json(data);

});



router.delete("/:id", async (req, res) => {

  const { id } = req.params;

  const { error } =
    await supabase
      .from("activos")
      .delete()
      .eq("id", id);

  if (error)
    return res.status(500).json(error);

  res.json({
    message: "Activo eliminado"
  });

});


module.exports = router;