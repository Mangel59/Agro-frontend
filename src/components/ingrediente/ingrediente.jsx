import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormIngrediente from "./FormIngrediente"
import GridIngrediente from "./GridIngrediente";

export default function Ingrediente() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [ingredientes, setIngredientes] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/ingrediente')
      .then(res => {
        const filas = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
        }));
        setIngredientes(filas);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar ingredientes" });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Ingredientes</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormIngrediente
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || { id: 0 }}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridIngrediente
        rows={ingredientes}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
