import React, { useState, useEffect } from "react";
import axios from "axios";
import FormProduccion from "./FormProduccion";
import GridProduccion from "./GridProduccion";
import { SiteProps } from "../dashboard/SiteProps";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

export default function Produccion() {
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [message, setMessage] = useState({ open: false, severity: "", text: "" });

  // Cargar las sedes al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "No se encontró el token de autenticación." });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/sede/minimal`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSedes(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar sedes:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar sedes. Verifica tu conexión." });
      });
  }, []);

  // Manejar cambio de sede
  const handleSedeChange = (sedeId) => {
    setSelectedSede(sedeId);
    setSelectedBloque("");
    setSelectedEspacio("");
    const token = localStorage.getItem("token");

    axios
      .get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBloques(response.data);
      })
      .catch((error) => console.error("Error al cargar bloques:", error));
  };

  // Manejar cambio de bloque
  const handleBloqueChange = (bloqueId) => {
    setSelectedBloque(bloqueId);
    setSelectedEspacio("");
    const token = localStorage.getItem("token");

    axios
      .get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEspacios(response.data);
      })
      .catch((error) => console.error("Error al cargar espacios:", error));
  };

  // Manejar cambio de espacio
  const handleEspacioChange = (espacioId) => {
    setSelectedEspacio(espacioId);
  };

  return (
    <div>
      <h1>Produccion</h1>
      <FormControl fullWidth margin="normal">
        <InputLabel id="sede-label">Selecciona una Sede</InputLabel>
        <Select
          labelId="sede-label"
          value={selectedSede}
          onChange={(e) => handleSedeChange(e.target.value)}
        >
          {sedes.map((sede) => (
            <MenuItem key={sede.id} value={sede.id}>
              {sede.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedSede}>
        <InputLabel id="bloque-label">Selecciona un Bloque</InputLabel>
        <Select
          labelId="bloque-label"
          value={selectedBloque}
          onChange={(e) => handleBloqueChange(e.target.value)}
        >
          {bloques.map((bloque) => (
            <MenuItem key={bloque.id} value={bloque.id}>
              {bloque.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
        <InputLabel id="espacio-label">Selecciona un Espacio</InputLabel>
        <Select
          labelId="espacio-label"
          value={selectedEspacio}
          onChange={(e) => handleEspacioChange(e.target.value)}
        >
          {espacios.map((espacio) => (
            <MenuItem key={espacio.id} value={espacio.id}>
              {espacio.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormProduccion reloadProducciones={() => {}} setMessage={setMessage} />
      {selectedEspacio ? (
        <GridProduccion espacioId={selectedEspacio} />
      ) : (
        <p>Selecciona un espacio para ver las producciones.</p>
      )}
    </div>
  );
}



