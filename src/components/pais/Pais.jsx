
import * as React from "react";
import { useEffect, useState } from "react"; // ✅ Esta línea es la clave
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPais from "./FormPais";
import GridPais from "./GridPais";
import { SiteProps } from "../dashboard/SiteProps";

export default function Pais() {
  const [selectedRow, setSelectedRow] = React.useState({ id: 0 });
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [paises, setPaises] = React.useState([]);

const reloadData = () => {
  const token = localStorage.getItem("token");
console.log("🔑 TOKEN:", token);

if (!token) {
  console.warn("❌ No hay token, no se puede hacer la petición.");
  return;
}
  axios.get("/api/v1/pais", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    const datosConId = res.data.map((p) => ({
      ...p,
      id: p.id,
      estadoId: p.estado?.id || null,
      empresaId: p.empresa?.id || null,
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
    <div style={{ height: "100%", width: "100%" }}>
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
