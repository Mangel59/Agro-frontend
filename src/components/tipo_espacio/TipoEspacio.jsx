import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEspacio from "./FormTipoEspacio";
import GridTipoEspacio from "./GridTipoEspacio";

export default function TipoEspacio() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tiposEspacio, setTiposEspacio] = useState([]);

  const reloadData = () => {
    axios.get("/v1/tipo_espacio")
      .then((res) => {
        const datos = res.data.map((item) => ({
          ...item,
          id: item.id,
          estadoId: item.estadoId
        }));
        setTiposEspacio(datos);
      })
      .catch((err) => {
        console.error("❌ Error al cargar tipos de espacio:", err);
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
      <h1>Gestión de Tipos de Espacio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoEspacio
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridTipoEspacio
        tiposEspacio={tiposEspacio}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
