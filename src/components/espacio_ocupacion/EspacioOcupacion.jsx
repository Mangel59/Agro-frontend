/**
 * Componente EspacioOcupacion.
 * @module EspacioOcupacion
 * @component
 * @returns {JSX.Element}
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import MessageSnackBar from "../MessageSnackBar";
import GridEspacioOcupacion from "./GridEspacioOcupacion";
import FormEspacioOcupacion from "./FromEspacioOcupacion";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function EspacioOcupacion() {
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);

  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");

  const [selectedRow, setSelectedRow] = useState({}); // ✅ evitar null
  const [reloadFlag, setReloadFlag] = useState(false); // ✅ flag booleano interno

  const [message, setMessage] = useState({
    open: false,
    severity: "info",
    text: "",
  });

  const triggerReload = () => setReloadFlag(!reloadFlag); // ✅ función para pasar a grid

  // Cargar sedes al inicio
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSedes(response.data || []);
      } catch (err) {
        console.error("Error al cargar las sedes:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar las sedes.",
        });
      }
    };
    fetchSedes();
  }, []);

  // Cargar bloques cuando cambia la sede
  useEffect(() => {
    if (!selectedSede) return;

    const fetchBloques = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/bloque/minimal/sede/${selectedSede}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBloques(response.data || []);
        setEspacios([]);
        setSelectedBloque("");
        setSelectedEspacio("");
      } catch (err) {
        console.error("Error al cargar los bloques:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar los bloques.",
        });
      }
    };

    fetchBloques();
  }, [selectedSede]);

  // Cargar espacios cuando cambia el bloque
  useEffect(() => {
    if (!selectedBloque) return;

    const fetchEspacios = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/espacio/minimal/bloque/${selectedBloque}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEspacios(response.data || []);
        setSelectedEspacio("");
      } catch (err) {
        console.error("Error al cargar los espacios:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar los espacios.",
        });
      }
    };

    fetchEspacios();
  }, [selectedBloque]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <h1>Espacio ocupación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Formulario */}
      <FormEspacioOcupacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={triggerReload} // ✅ ahora sí es función
      />

      {/* Selectores */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Sede</InputLabel>
        <Select
          value={selectedSede}
          onChange={(e) => setSelectedSede(e.target.value)}
        >
          {sedes.map((sede) => (
            <MenuItem key={sede.id} value={sede.id}>
              {sede.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedSede}>
        <InputLabel>Bloque</InputLabel>
        <Select
          value={selectedBloque}
          onChange={(e) => setSelectedBloque(e.target.value)}
        >
          {bloques.map((bloque) => (
            <MenuItem key={bloque.id} value={bloque.id}>
              {bloque.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
        <InputLabel>Espacio</InputLabel>
        <Select
          value={selectedEspacio}
          onChange={(e) => setSelectedEspacio(e.target.value)}
        >
          {espacios.map((espacio) => (
            <MenuItem key={espacio.id} value={espacio.id}>
              {espacio.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Tabla */}
      <GridEspacioOcupacion
        selectedEspacio={selectedEspacio}
        setSelectedRow={setSelectedRow}
        reloadFlag={reloadFlag} // ✅ usar flag como trigger
      />
    </Box>
  );
}
