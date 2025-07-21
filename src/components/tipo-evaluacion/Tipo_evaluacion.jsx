import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEvaluacion from "./FormTipoEvaluacion.jsx";
import GridTipoEvaluacion from "./GridTipoEvaluacion.jsx";

export default function TipoEvaluacion() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [TipoEvaluacion, setTipoEvaluacion] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/tipo-evaluacion')
      .then(res => {
        const data = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
        }));
        setTipoEvaluacion(data);
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar los tipos de evaluacion"
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Tipo de Evaluacion</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoEvaluacion
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridTipoEvaluacion
        rows={TipoEvaluacion}
        selectedRow={selectedRow}
        setSelectedRow={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
