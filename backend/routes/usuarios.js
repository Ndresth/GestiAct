const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// ============================
// OBTENER USUARIOS
// ============================
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// ============================
// CREAR USUARIO
// ============================
router.post("/", async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // CREAR EN AUTH
    const { error: authError } = await supabase.auth.admin.createUser({
      email: correo,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      console.log(authError);
      return res.status(500).json(authError);
    }

    // GUARDAR EN TABLA
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nombre, correo, password, rol }])
      .select();

    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// ============================
// EDITAR USUARIO
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, password, rol } = req.body;

    const { data, error } = await supabase
      .from("usuarios")
      .update({ nombre, correo, password, rol })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// ============================
// ELIMINAR USUARIO
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;