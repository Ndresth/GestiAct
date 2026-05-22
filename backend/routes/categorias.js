const express = require("express");

const router = express.Router();

const supabase =
require("../supabaseClient");



// ============================
// LISTAR CATEGORIAS
// ============================

router.get("/", async (req, res) => {

  const { data, error } =
    await supabase
      .from("categorias")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error)
    return res.status(500).json(error);

  res.json(data);

});




// ============================
// CREAR CATEGORIA
// ============================

router.post("/", async (req, res) => {

  const {
    nombre,
    descripcion
  } = req.body;

  const { data, error } =
    await supabase
      .from("categorias")
      .insert([
        {
          nombre,
          descripcion
        }
      ])
      .select();

  if (error)
    return res.status(500).json(error);

  res.json(data);

});




// ============================
// ACTUALIZAR CATEGORIA
// ============================

router.put("/:id", async (req, res) => {

  const { id } = req.params;

  const {
    nombre,
    descripcion
  } = req.body;

  const { data, error } =
    await supabase
      .from("categorias")
      .update({
        nombre,
        descripcion
      })
      .eq("id", id)
      .select();

  if (error)
    return res.status(500).json(error);

  res.json(data);

});




// ============================
// ELIMINAR CATEGORIA
// ============================

router.delete("/:id", async (req, res) => {

  const { id } = req.params;

  const { error } =
    await supabase
      .from("categorias")
      .delete()
      .eq("id", id);

  if (error)
    return res.status(500).json(error);

  res.json({
    message: "Categoria eliminada"
  });

});



module.exports = router;