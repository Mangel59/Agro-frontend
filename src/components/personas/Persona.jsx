import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPersona from "./FormPersona";
import GridPersona from "./GridPersona";

export default function Persona() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [personas, setPersonas] = useState([]);

  const reloadData = async () => {
    try {
      const [personaRes, tiposRes] = await Promise.all([
        axios.get("/v1/persona"),
        axios.get("/v1/items/tipo_identificacion/1"),
      ]);

      // Mapa de tipos: id => name
      const tiposMap = Object.fromEntries(tiposRes.data.map(tipo => [tipo.id, tipo.name]));

      const personas = (personaRes.data.content || []).map((persona) => ({
        ...persona,
        tipoIdentificacionNombre: tiposMap[persona.tipoIdentificacion] || "N/A" 
      }));

      setPersonas(personas);
    } catch (err) {
      console.error("❌ Error al cargar personas o tipos:", err);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar datos"
      });
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Personas</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPersona
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridPersona
        personas={personas}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
