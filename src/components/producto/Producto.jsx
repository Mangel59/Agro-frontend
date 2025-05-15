import React, { useEffect, useState } from 'react';  // Importación correcta de useEffect
import axios from "axios";
import FormProduccion from "../produccion/FormProduccion";
import GridProduccion from "../produccion/GridProduccion";
import { SiteProps } from "../dashboard/SiteProps";
import { FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material";

export default function Produccion() {
  const [sedes, setSedes] = useState([]);  // Estado para Sedes
  const [bloques, setBloques] = useState([]);  // Estado para Bloques
  const [espacios, setEspacios] = useState([]);  // Estado para Espacios

  const [selectedSede, setSelectedSede] = useState("");  // Estado para Sede seleccionada
  const [selectedBloque, setSelectedBloque] = useState("");  // Estado para Bloque seleccionado
  const [selectedEspacio, setSelectedEspacio] = useState("");  // Estado para Espacio seleccionado

  const [reloadProduccionesFn, setReloadProduccionesFn] = useState(null);  // Función para recargar las producciones
  const [message, setMessage] = useState({ open: false, severity: "", text: "" });  // Estado para mensajes

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Estas dos peticiones no necesitan Authorization
        const [sedesRes, bloquesRes] = await Promise.all([
          axios.get(`${SiteProps.urlbasev1}/sede/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${SiteProps.urlbasev1}/bloque/all`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setSedes(sedesRes.data || []);  // Guardar las Sedes
        setBloques(bloquesRes.data || []);  // Guardar los Bloques
      } catch (error) {
        console.error("Error al cargar las sedes o bloques:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar datos iniciales." });
      }
    };

    fetchData();
  }, [token]);  // Ejecutar solo si el token cambia

  const handleSedeChange = (value) => {
    setSelectedSede(value);
    setSelectedBloque("");  // Limpiar Bloque y Espacio al cambiar la Sede
    setSelectedEspacio("");
  };

  const handleBloqueChange = (value) => {
    setSelectedBloque(value);
    setSelectedEspacio("");  // Limpiar Espacio al cambiar el Bloque
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Producto</h1>

      <FormControl fullWidth margin="normal">
        <InputLabel>Sede</InputLabel>
        <Select value={selectedSede} onChange={(e) => handleSedeChange(e.target.value)}>
          {sedes.map((s) => (
            <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedSede}>
        <InputLabel>Bloque</InputLabel>
        <Select value={selectedBloque} onChange={(e) => handleBloqueChange(e.target.value)}>
          {bloques.map((b) => (
            <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
        <InputLabel>Espacio</InputLabel>
        <Select value={selectedEspacio} onChange={(e) => setSelectedEspacio(e.target.value)}>
          {espacios.map((e) => (
            <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormProduccion
        reloadProducciones={reloadProduccionesFn}
        setMessage={setMessage}
      />

      {selectedEspacio && (
        <GridProduccion
          espacioId={selectedEspacio}
          selectedSede={selectedSede}
          selectedBloque={selectedBloque}
          selectedEspacio={selectedEspacio}
          exposeReload={(fn) => setReloadProduccionesFn(() => fn)}
        />
      )}

      <Snackbar open={message.open} autoHideDuration={3000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert severity={message.severity}>{message.text}</Alert>
      </Snackbar>
    </div>
  );
}
