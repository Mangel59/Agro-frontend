import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPresentacion from "./FormPresentacion";
import GridPresentacion from "./GridPresentacion";

export default function Presentacion() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [presentaciones, setPresentaciones] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/presentacion')
      .then(res => {
        const filas = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId
        }));
        setPresentaciones(filas);
      })
      .catch(err => {
        console.error("❌ Error al cargar presentaciones:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar presentaciones"
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Presentaciones</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormPresentacion
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridPresentacion
        rows={presentaciones}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
