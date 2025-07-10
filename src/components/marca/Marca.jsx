import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";

export default function Marca() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [marcas, setMarcas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/marca')
      .then(res => setMarcas(res.data))
      .catch(err => {
        console.error("❌ Error al cargar marcas:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar marcas"
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Marcas</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormMarca
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridMarca
        rows={marcas}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
