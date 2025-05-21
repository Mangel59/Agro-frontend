import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoIdentificacion from "./FormTipoIdentificacion";
import GridTipoIdentificacion from "./GridTipoIdentificacion";
import { Button } from "@mui/material";

export default function TipoIdentificacion() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/tipo_identificacion')
      .then(res => {
        const filas = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId, // por si viene como objeto
          nombreCompleto: item.nombre + ' ' + item.codigo,
        }));
        setTiposIdentificacion(filas);
      })
      .catch(err => {
        console.error("❌ Error al cargar tipos de identificación:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar tipos de identificación"
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Tipos de Identificación</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoIdentificacion
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || { id: 0 }}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridTipoIdentificacion
        rows={tiposIdentificacion}
        selectedRow={selectedRow}
        setSelectedRow={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
