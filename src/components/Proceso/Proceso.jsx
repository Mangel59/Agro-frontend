import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProceso from "./FromProceso";
import GridProceso from "./GridProceso";

export default function Proceso() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [procesos, setProcesos] = useState([]);

  const reloadData = () => {
    axios.get("/v1/proceso")
      .then((res) => {
        const datosConId = res.data.map((p) => ({
          ...p,
          id: p.id,
          tipoProduccionNombre: p.tipoProduccion?.nombre || "",
        }));
        setProcesos(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar procesos:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar procesos",
        });
      });
  };
  

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Procesos</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProceso
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridProceso
        procesos={procesos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
