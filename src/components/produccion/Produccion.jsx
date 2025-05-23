// Produccion.jsx
import * as React from "react";
import axios from "axios";
import FormProduccion from "./FormProduccion";
import GridProduccion from "./GridProduccion";
import { SiteProps } from "../dashboard/SiteProps";
import { FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material";

export default function Produccion() {
  const [sedes, setSedes] = React.useState([]);
  const [bloques, setBloques] = React.useState([]);
  const [espacios, setEspacios] = React.useState([]);

  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedBloque, setSelectedBloque] = React.useState("");
  const [selectedEspacio, setSelectedEspacio] = React.useState("");

  const [reloadProduccionesFn, setReloadProduccionesFn] = React.useState(null);

  const [message, setMessage] = React.useState({ open: false, severity: "", text: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Estos dos NO necesitan Authorization
        const [municipioRes, tipoSedeRes] = await Promise.all([
          axios.get(`${SiteProps.urlbasev1}/municipio/all`),
          axios.get(`${SiteProps.urlbasev1}/tipo_sede/minimal`),
        ]);
  
        setMunicipios(municipioRes.data || []);
        setTipoSedes(tipoSedeRes.data || []);
      } catch (error) {
        console.error("Error al cargar municipios o tipos de sede:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar datos iniciales." });
      }
    };
  
    fetchData();
  }, [setMessage]);
  
  return (
    <div style={{ padding: 16 }}>
      <h1>Producción</h1>

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
