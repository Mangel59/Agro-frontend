import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormGrupo from "./FormGrupo";
import GridGrupo from "./GridGrupo";

export default function Grupo() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [grupos, setGrupos] = useState([]);

  const reloadData = () => {
    axios.get("/v1/grupo")
      .then((res) => {
        const datosConId = res.data.map((g) => ({
            ...g,
            id: g.id,
            estadoId: g.estadoId
          }));
                  
        setGrupos(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar grupos:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar grupos",
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Grupos</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormGrupo
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridGrupo
        grupos={grupos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
