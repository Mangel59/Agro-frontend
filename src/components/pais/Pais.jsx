import React, { useState, useEffect } from "react";
import axios from "../axiosConfig"; 
import MessageSnackBar from "../MessageSnackBar";
import FormPais from "./FormPais";
import GridPais from "./GridPais";

export default function Pais() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [paises, setPaises] = useState([]);

  const reloadData = () => {
    axios.get("/v1/pais")
      .then((res) => {
        const datosConId = res.data.map((p) => ({
          ...p,
          id: p.id,
          estadoId: p.estado?.id || null, 
        }));
        setPaises(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar países:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar países",
        });
      });
  };
  

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Países</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPais
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridPais
        paises={paises}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
