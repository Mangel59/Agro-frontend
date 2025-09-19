import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoInventario from "./FormTipoInventario";
import GridTipoInventario from "./GridTipoInventario";

export default function TipoInventario() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tiposInventario, setTiposInventario] = useState([]);

  const reloadData = () => {
    axios.get("/v1/tipo_inventario")
      .then((res) => {
        const datos = res.data.map((item) => ({
          ...item,
          id: item.id,
          estadoId: item.estadoId
        }));
        setTiposInventario(datos);
      })
      .catch((err) => {
        console.error("❌ Error al cargar tipos de inventario:", err);
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
      <h1>Gestión de Tipos de Inventario</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoInventario
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridTipoInventario
        tiposInventario={tiposInventario}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
