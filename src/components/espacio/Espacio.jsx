import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormEspacio from "./FormEspacio";
import GridEspacio from "./GridEspacio";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";

export default function Espacio() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const token = localStorage.getItem("token");
  const empresaId = localStorage.getItem("empresaId");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data));
  }, []);

  useEffect(() => {
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers).then(res => {
      setDepartamentos(res.data.filter(d => d.paisId === parseInt(selectedPais)));
    });
  }, [selectedPais]);

  useEffect(() => {
    if (!selectedDepto) return;
    axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setMunicipios(data);
    });
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]);
    setSelectedSede("");
    setBloques([]);
    setSelectedBloque("");
    setEspacios([]);
    setSelectedRow(null);

    if (!selectedMunicipio) return;

    axios.get(`/v1/sede`, headers)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const filtradas = data.filter(
          s => s.municipioId == selectedMunicipio && s.empresaId == empresaId
        );
        setSedes(filtradas);
      });
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]);
    setSelectedBloque("");
    setEspacios([]);
    if (selectedSede) {
      axios.get(`/v1/bloque`, headers).then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const filtrados = data.filter(b => String(b.sedeId) === String(selectedSede));
        setBloques(filtrados);
      });
    }
  }, [selectedSede]);

 const reloadData = () => {
  if (!selectedBloque) return setEspacios([]);
  axios.get(`/v1/espacio`, headers).then(res => {
    const data = Array.isArray(res.data) ? res.data : [];
    const filtrados = data.filter(e => String(e.bloqueId) === String(selectedBloque));
    setEspacios(filtrados);
  });
};


  useEffect(() => {
    reloadData();
  }, [selectedBloque]);

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar el espacio "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/espacio/${selectedRow.id}`, headers);
        setMessage({ open: true, severity: "success", text: "Espacio eliminado correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar espacio." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Espacios</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>País</InputLabel>
        <Select value={selectedPais} onChange={e => setSelectedPais(e.target.value)} label="País">
          {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPais}>
        <InputLabel>Departamento</InputLabel>
        <Select value={selectedDepto} onChange={e => setSelectedDepto(e.target.value)} label="Departamento">
          {departamentos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedDepto}>
        <InputLabel>Municipio</InputLabel>
        <Select value={selectedMunicipio} onChange={e => setSelectedMunicipio(e.target.value)} label="Municipio">
          {municipios.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedMunicipio}>
        <InputLabel>Sede</InputLabel>
        <Select value={selectedSede} onChange={e => setSelectedSede(e.target.value)} label="Sede">
          {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedSede}>
        <InputLabel>Bloque</InputLabel>
        <Select value={selectedBloque} onChange={e => setSelectedBloque(e.target.value)} label="Bloque">
          {bloques.map(b => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }} disabled={!selectedBloque}>+ Agregar Espacio</Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>Editar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>Eliminar</Button>
      </Box>

      <GridEspacio espacios={espacios} setSelectedRow={setSelectedRow} />

      <FormEspacio
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        bloqueId={selectedBloque}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
