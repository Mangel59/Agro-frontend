import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoBloque from "./FormTipoBloque.jsx";
import GridTipoBloque from "./GridTipoBloque.jsx";

export default function TipoBloque() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tiposBloque, setTiposBloque] = useState([]);

  const reloadData = () => {
    axios.get("/v1/tipo_bloque")
      .then((res) => {
        const datos = res.data.map((item) => ({
          ...item,
          id: item.id,
          estadoId: item.estadoId,
          empresaId: item.empresaId
        }));
        setTiposBloque(datos);
      })
      .catch((err) => {
        console.error("❌ Error al cargar tipos de bloque:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar datos",
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Tipos de Bloque</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoBloque
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridTipoBloque
        tiposBloque={tiposBloque}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
