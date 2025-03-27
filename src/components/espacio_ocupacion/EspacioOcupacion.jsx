/**
 * @file EspacioOcupacion.jsx
 * @module EspacioOcupacion
 * @description Componente principal para gestionar la ocupación de espacios.
 * Permite seleccionar sede, bloque y espacio, y visualizar/administrar ocupaciones a través de una grilla y formulario.
 * Conecta con el backend para obtener los datos y actualizar la grilla de ocupación de espacios.
 * Utiliza Axios para llamadas HTTP y Material UI para la interfaz.
 * @author Karla
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
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad del mensaje ('success', 'error', etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para la gestión de ocupaciones de espacios.
 *
 * @component
 * @returns {JSX.Element} Interfaz de usuario para seleccionar sedes, bloques y espacios,
 * y gestionar registros de ocupación.
 */
export default function EspacioOcupacion() {
  const [sedes, setSedes] = useState([]);                      // Lista de sedes
  const [bloques, setBloques] = useState([]);                  // Lista de bloques por sede
  const [espacios, setEspacios] = useState([]);                // Lista de espacios por bloque
  const [selectedSede, setSelectedSede] = useState("");        // ID de sede seleccionada
  const [selectedBloque, setSelectedBloque] = useState("");    // ID de bloque seleccionado
  const [selectedEspacio, setSelectedEspacio] = useState("");  // ID de espacio seleccionado
  const [selectedRow, setSelectedRow] = useState(null);        // Fila seleccionada
  const [reloadData, setReloadData] = useState(false);         // Recarga de grilla
  const [message, setMessage] = useState(/** @type {SnackbarMessage} */({
    open: false,
    severity: "info",
    text: "",
  }));

  /**
   * Carga la lista de sedes al iniciar el componente.
   */
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

  /**
   * Carga los bloques disponibles cuando se selecciona una sede.
   */
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

  /**
   * Carga los espacios disponibles cuando se selecciona un bloque.
   */
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

      {/* Snackbar de mensajes */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Formulario de agregar/editar ocupación */}
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

      {/* Tabla de ocupaciones */}
      <GridEspacioOcupacion
        selectedEspacio={selectedEspacio}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
    </Box>
  );
}
