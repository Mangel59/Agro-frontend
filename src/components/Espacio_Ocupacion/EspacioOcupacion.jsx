import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import MessageSnackBar from "../MessageSnackBar";
import GridEspacioOcupacion from "./GridEspacioOcupacion";
import FormEspacioOcuOcupacion from "./FromEspacioOcupacion";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function EspacioOcupacion() {
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);

  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");

  const [selectedRow, setSelectedRow] = useState(null); // Controla la fila seleccionada
  const [reloadData, setReloadData] = useState(false); // Estado para recargar datos

  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  // Carga de sedes al montar el componente
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

  // Carga de bloques al seleccionar una sede
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

  // Carga de espacios al seleccionar un bloque
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
      <MessageSnackBar message={message} setMessage={setMessage} />

      <Typography variant="h6" gutterBottom>
        Espacio Ocupación
      </Typography>

      {/* Formulario */}
      <FormEspacioOcuOcupacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={() => setReloadData(!reloadData)} // Recarga solo al guardar/actualizar
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
        reloadData={reloadData} // Recarga cuando sea necesario
      />
    </Box>
  );
}
