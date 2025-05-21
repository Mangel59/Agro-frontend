import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoSede from "./FormTipoSede";
import GridTipoSede from "./GridTipoSede";

export default function TipoSede() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [tiposSede, setTiposSede] = useState([]);

  const reloadData = () => {
    axios.get("/v1/tipo_sede")
      .then((res) => {
        const datos = res.data.map((item) => ({
          ...item,
          id: item.id,
          estadoId: item.estadoId
        }));
        setTiposSede(datos);
      })
      .catch((err) => {
        console.error("❌ Error al cargar tipos de sede:", err);
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
      <h1>Gestión de Tipos de Sede</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoSede
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridTipoSede
        tiposSede={tiposSede}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
