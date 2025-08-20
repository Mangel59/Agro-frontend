import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormUnidad from "./FormUnidad";
import GridUnidad from "./GridUnidad";

export default function Unidad() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [unidades, setUnidades] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/unidad')
      .then(res => {
        const filas = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
        }));
        setUnidades(filas);
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: "Error al cargar unidades" });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1> Unidades</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormUnidad
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || { id: 0 }}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridUnidad
        rows={unidades}
        selectedRow={selectedRow}
        setSelectedRow={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
