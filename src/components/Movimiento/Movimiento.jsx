import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormMovimineto from "../Movimiento/FromMovimiento"
import GridMovimineto from "./GridMovimiento";

export default function Movimineto() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [Movimineto, setMovimineto] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = () => {
    axios.get('/v1/movimiento')
      .then(res => {
        const filas = res.data.map(item => ({
          ...item,
          estadoId: item.estado?.id || item.estadoId,
        }));
        setMovimineto(filas);
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: "Error al cargar Movimineto" });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Movimineto</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormMovimineto
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || { id: 0 }}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridMovimineto
        rows={Movimineto}
        selectedRow={selectedRow}
        setSelectedRow={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
