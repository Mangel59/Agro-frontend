import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOcupacion from "./FormOcupacion";
import GridOcupacion from "./GridOcupacion";

export default function Ocupacion() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [ocupaciones, setOcupaciones] = useState([]);

  const reloadData = async () => {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const resOcupaciones = await axios.get("/v1/ocupacion", headers);

      // Mostrar tipoActividadId directamente si no se puede obtener el nombre
      const data = resOcupaciones.data.map((o) => ({
        ...o,
        tipoActividadNombre: `${o.tipoActividadId}`, // temporal
      }));

      setOcupaciones(data);
    } catch (err) {
      console.error("❌ Error al cargar Actividad ocupaciones:", err);
      setMessage({ open: true, severity: "error", text: "Error al cargar  Actividad ocupaciones" });
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Actividad Ocupaciones</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormOcupacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridOcupacion
        ocupaciones={ocupaciones}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
