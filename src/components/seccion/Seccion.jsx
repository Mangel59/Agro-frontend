import React, { useEffect, useState } from "react";
import axios from "../axiosConfig.js";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormSeccion from "./FromSeccion.jsx";
import GridSeccion from "./GridSeccion.jsx";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";

export default function Seccion() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [secciones, setSecciones] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { axios.get("/v1/pais", headers).then(res => setPaises(res.data)); }, []);

  useEffect(() => {
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]); setSelectedMunicipio("");
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]);
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers).then(res => {
      setDepartamentos(res.data.filter(dep => dep.paisId === parseInt(selectedPais)));
    });
  }, [selectedPais]);

  useEffect(() => {
    setMunicipios([]); setSelectedMunicipio("");
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]);
    if (!selectedDepto) return;
    axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => {
      setMunicipios(res.data);
    });
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]);
    if (!selectedMunicipio) return;
    axios.get("/v1/sede", headers).then(res => {
      setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
    });
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]);
    if (!selectedSede) return;
    axios.get(`/v1/bloque`, headers).then(res => {
      setBloques(res.data.filter(b => b.sedeId === parseInt(selectedSede)));
    });
  }, [selectedSede]);

  useEffect(() => {
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]);
    if (!selectedBloque) return;
    axios.get(`/v1/espacio`, headers).then(res => {
      setEspacios(res.data.filter(e => e.bloqueId === parseInt(selectedBloque)));
    });
  }, [selectedBloque]);

  const reloadData = () => {
    if (!selectedEspacio) return setSecciones([]);
    axios.get(`/v1/seccion`, headers).then(res => {
      setSecciones(res.data.filter(s => s.espacioId === parseInt(selectedEspacio)));
    });
  };

  useEffect(() => { reloadData(); }, [selectedEspacio]);

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar la sección "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/seccion/${selectedRow.id}`, headers);
        setMessage({ open: true, severity: "success", text: "Sección eliminada correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar sección." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Secciones</Typography>

      {[{
        label: "País", value: selectedPais, setValue: setSelectedPais, items: paises
      }, {
        label: "Departamento", value: selectedDepto, setValue: setSelectedDepto, items: departamentos, disabled: !selectedPais
      }, {
        label: "Municipio", value: selectedMunicipio, setValue: setSelectedMunicipio, items: municipios, disabled: !selectedDepto
      }, {
        label: "Sede", value: selectedSede, setValue: setSelectedSede, items: sedes, disabled: !selectedMunicipio
      }, {
        label: "Bloque", value: selectedBloque, setValue: setSelectedBloque, items: bloques, disabled: !selectedSede
      }, {
        label: "Espacio", value: selectedEspacio, setValue: setSelectedEspacio, items: espacios, disabled: !selectedBloque
      }].map(({ label, value, setValue, items, disabled }, i) => (
        <FormControl key={i} fullWidth sx={{ mb: 2 }} disabled={disabled}>
          <InputLabel>{label}</InputLabel>
          <Select value={value} onChange={e => setValue(e.target.value)} label={label}>
            {items.map(opt => <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>)}
          </Select>
        </FormControl>
      ))}

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }} disabled={!selectedEspacio}>+ Agregar Sección</Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>Editar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>Eliminar</Button>
      </Box>

      <GridSeccion secciones={secciones} setSelectedRow={setSelectedRow} />

      <FormSeccion
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        espacioId={selectedEspacio}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
