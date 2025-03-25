/**
 * @file EspacioOcupacion.jsx
 * @module EspacioOcupacion
 * @description Componente principal para gestionar la ocupación de espacios.
 * Permite seleccionar sede, bloque y espacio, y visualizar/administrar ocupaciones a través de una grilla y formulario.
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
import FormEspacioOcuOcupacion from "./FromEspacioOcupacion";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente principal para la gestión de ocupaciones de espacios.
 *
 * @component
 * @returns {JSX.Element} Interfaz de usuario para seleccionar sedes, bloques y espacios,
 *                        y gestionar registros de ocupación.
 */
export default function EspacioOcupacion() {
  /** Lista de sedes disponibles. */
  const [sedes, setSedes] = useState([]);

  /** Lista de bloques disponibles según la sede seleccionada. */
  const [bloques, setBloques] = useState([]);

  /** Lista de espacios disponibles según el bloque seleccionado. */
  const [espacios, setEspacios] = useState([]);

  /** ID de la sede seleccionada. */
  const [selectedSede, setSelectedSede] = useState("");

  /** ID del bloque seleccionado. */
  const [selectedBloque, setSelectedBloque] = useState("");

  /** ID del espacio seleccionado. */
  const [selectedEspacio, setSelectedEspacio] = useState("");

  /** Registro actualmente seleccionado para editar/eliminar. */
  const [selectedRow, setSelectedRow] = useState(null);

  /** Bandera que fuerza la recarga de datos en la grilla. */
  const [reloadData, setReloadData] = useState(false);

  /** Mensaje para mostrar en el snackbar. */
  const [message, setMessage] = useState({
    open: false,
    severity: "info",
    text: "",
  });

  // 🔄 Cargar sedes al montar el componente
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // 🔄 Cargar bloques cuando se seleccione una sede
  useEffect(() => {
    if (!selectedSede) return;

    const fetchBloques = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/bloque/minimal/sede/${selectedSede}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setBloques(response.data || []);
        setEspacios([]); // Reinicia espacios
        setSelectedBloque(""); // Reinicia selección
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

  // 🔄 Cargar espacios cuando se seleccione un bloque
  useEffect(() => {
    if (!selectedBloque) return;

    const fetchEspacios = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/espacio/minimal/bloque/${selectedBloque}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setEspacios(response.data || []);
        setSelectedEspacio(""); // Reinicia selección de espacio
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

      {/* Snackbar para mensajes */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Formulario de creación/edición */}
      <FormEspacioOcuOcupacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={() => setReloadData(!reloadData)}
      />

      {/* Selector de sede */}
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

      {/* Selector de bloque */}
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

      {/* Selector de espacio */}
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

      {/* Grilla de registros */}
      <GridEspacioOcupacion
        selectedEspacio={selectedEspacio}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
    </Box>
  );
}
