import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormIngredientePresentacionP from "./FormIngredientePresentacionP.jsx";
import GridIngredientePresentacionP from "./GridIngredientePresentacionP.jsx";

export default function IngredientePresentacionProducto() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [datos, setDatos] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('v1/ingrediente-presentacion-producto')
      .then(res => setDatos(res.data))
      .catch(err => {
        console.error("❌ Error al cargar datos:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar datos"
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Ingrediente Producto Presentacion</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormIngredientePresentacionP
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridIngredientePresentacionP
        rows={datos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
