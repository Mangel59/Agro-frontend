import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoMovimiento from "./FormTipoMovimiento";
import GridTipoMovimiento from "./GridTipoMovimiento";

export default function TipoMovimiento() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tipoMovimientos, setTipoMovimientos] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [movimientos, setMovimientos] = useState([]);

  const reloadData = () => {
    axios.get('/v1/tipo_movimiento')
      .then(res => {
        const filas = res.data?.data || res.data;
        const transformados = filas.map(item => {
          const mov = movimientos.find(m => m.id === item.movimientoId);
          return {
            ...item,
            estado: item.estadoId ?? item.estado,
            movimientoNombre: mov ? mov.nombre : item.movimientoId,
          };
        });
        setTipoMovimientos(transformados);
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: "Error al cargar tipos de movimiento" });
      });
  };

  useEffect(() => {
    axios.get('/v1/movimiento')
      .then(res => {
        setMovimientos(res.data || []);
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: "Error al cargar movimientos" });
      });
  }, []);

  useEffect(() => {
    if (movimientos.length > 0) {
      reloadData();
    }
  }, [movimientos]);

  return (
    <div>
      <h1>Tipo de Movimiento</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoMovimiento
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || { id: 0 }}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridTipoMovimiento
        rows={tipoMovimientos}
        selectedRow={selectedRow}
        setSelectedRow={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
