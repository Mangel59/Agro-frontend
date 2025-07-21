
import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import Formtipobloque from "./Formtipobloque";
import Gridtipobloque from "./Gridtipobloque";

export default function TipoBloque() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tipobloques, settipobloques] = useState([]);


  const reloadData = () => {
    axios.get("/v1/tipo_bloque")
      .then((res) => {
        const datosConId = res.data.map((g) => ({
          ...g,
          id: g.id,
          estadoId: g.estadoId
        }));
        settipobloques(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar tipobloques:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar tipobloques",
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de tipobloques</h1>

      {/* Notificación Snackbar */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Formulario de creación/edición */}
      <Formtipobloque
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      {/* Tabla de visualización */}
      <Gridtipobloque
       tiposBloque={tipobloques}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
