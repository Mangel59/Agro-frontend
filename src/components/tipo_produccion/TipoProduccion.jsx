import React, { useState, useEffect } from "react";
import axios from "../axiosConfig"; 
import MessageSnackBar from "../MessageSnackBar";
import FormTipoProduccion from "./FormTipoProduccion";
import GridTipoProduccion from "./GridTipoProduccion";

export default function TipoProduccion() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tipos, setTipos] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

 const reloadData = () => {
  axios.get("/v1/tipo_produccion", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  })
    .then(res => {
      if (Array.isArray(res.data)) {
        setTipos(res.data);
      } else {
        console.error("❌ Respuesta inesperada:", res.data);
        setMessage({ open: true, severity: "error", text: "Respuesta inválida del servidor." });
      }
    })
    .catch(err => {
      console.error("❌ Error al cargar tipos de producción:", err);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar tipos de producción"
      });
    });
};

useEffect(() => {
  reloadData();
}, []);


  return (
    <div>
      <h1>Gestión de Tipo de Producción</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoProduccion
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridTipoProduccion
        rows={tipos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
