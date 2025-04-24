import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";

/**
 * @typedef {Object} SedeRow
 * @property {number} id - ID de la sede
 * @property {string} grupo - ID o nombre del grupo
 * @property {string} tipoSede - ID o nombre del tipo de sede
 * @property {string} nombre - Nombre de la sede
 * @property {string} municipioId - ID del municipio
 * @property {string|Object} geolocalizacion - Ubicación geográfica
 * @property {string} coordenadas - Coordenadas manuales
 * @property {number} area - Área de la sede
 * @property {string} comuna - Comuna donde se ubica
 * @property {string} descripcion - Descripción de la sede
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Severidad (success, error, etc)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para gestionar las sedes.
 * @component
 * @returns {JSX.Element}
 */
export default function Sede() {
  const initialRow = {
    id: 0,
    grupo: "",
    tipoSede: "",
    nombre: "",
    municipioId: "",
    geolocalizacion: "",
    coordenadas: "",
    area: 0,
    comuna: "",
    descripcion: "",
    estado: 1,
  };

  const [sedes, setSedes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(initialRow);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  const token = localStorage.getItem("token");

  // Define fetchData outside of useEffect
  const fetchData = async () => {
    if (!token) return;

    try {
      const res = await axios.get('/api/v1/sede/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSedes(
        (res.data || []).map((sede, index) => ({
          ...sede,
          id: sede.id ?? `temp-${index}`,
        }))
      );

      setMessage({ open: false });
    } catch (error) {
      console.error("Error al cargar las sedes:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar las sedes. Intente nuevamente.",
      });
    }
  };

  // Call fetchData inside useEffect
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <h1>Sede</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormSede
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={fetchData}
        setMessage={setMessage}
      />
      <GridSede
        sedes={sedes}
        setSelectedRow={setSelectedRow}
        reloadData={fetchData}
      />
    </Box>
  );
}
