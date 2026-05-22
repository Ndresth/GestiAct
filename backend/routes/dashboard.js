const express = require("express");

const router = express.Router();

const supabase =
require("../supabaseClient");




// ============================
// DASHBOARD
// ============================

router.get("/", async (req, res) => {

  try {




    // TOTAL ACTIVOS

    const {
      count: totalActivos
    } =
    await supabase
      .from("activos")
      .select("*", {
        count: "exact",
        head: true
      });




    // TOTAL USUARIOS

    const {
      count: totalUsuarios
    } =
    await supabase
      .from("usuarios")
      .select("*", {
        count: "exact",
        head: true
      });




    // TOTAL CATEGORIAS

    const {
      count: totalCategorias
    } =
    await supabase
      .from("categorias")
      .select("*", {
        count: "exact",
        head: true
      });




    // ULTIMOS ACTIVOS

    const {
      data: ultimosActivos
    } =
    await supabase
      .from("activos")
      .select("*")
      .order("created_at", {
        ascending: false
      })
      .limit(5);




    // ACTIVOS POR CATEGORIA

    const {
      data: activosCategoria
    } =
    await supabase
      .from("activos")
      .select("categoria");




    const categoriasMap = {};




    activosCategoria.forEach((a) => {

      if (!categoriasMap[a.categoria]) {

        categoriasMap[a.categoria] = 0;

      }

      categoriasMap[a.categoria]++;

    });




    const categorias =
      Object.keys(categoriasMap)
      .map((key) => ({

        categoria: key,

        total:
        categoriasMap[key]

      }));




    res.json({

      totalActivos,
      totalUsuarios,
      totalCategorias,
      ultimosActivos,
      categorias

    });




  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error dashboard"
    });

  }

});




module.exports = router;