import React, { useEffect, useState } from "react";
import axios from "../components/axiosConfig.js";
import MessageSnackBar from "../components/MessageSnackBar.jsx";
import FormSubseccion from "./FormSubseccion.jsx";
import GridSubseccion from "./GridSubseccion.jsx";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";

export default function Subseccion() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [subsecciones, setSubsecciones] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [selectedSeccion, setSelectedSeccion] = useState("");

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
    setSecciones([]); setSelectedSeccion("");
    setSubsecciones([]);
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
    setSecciones([]); setSelectedSeccion("");
    setSubsecciones([]);
    if (!selectedDepto) return;
    axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => {
      setMunicipios(res.data);
    });
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]); setSelectedSeccion("");
    setSubsecciones([]);
    if (!selectedMunicipio) return;
    axios.get("/v1/sede", headers).then(res => {
      setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
    });
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]); setSelectedSeccion("");
    setSubsecciones([]);
    if (!selectedSede) return;
    axios.get(`/v1/bloque`, headers).then(res => {
      setBloques(res.data.filter(b => b.sedeId === parseInt(selectedSede)));
    });
  }, [selectedSede]);

  useEffect(() => {
    setEspacios([]); setSelectedEspacio("");
    setSecciones([]); setSelectedSeccion("");
    setSubsecciones([]);
    if (!selectedBloque) return;
    axios.get(`/v1/espacio`, headers).then(res => {
      setEspacios(res.data.filter(e => e.bloqueId === parseInt(selectedBloque)));
    });
  }, [selectedBloque]);

  useEffect(() => {
    setSecciones([]); setSelectedSeccion("");
    setSubsecciones([]);
    if (!selectedEspacio) return;
    axios.get(`/v1/seccion`, headers).then(res => {
      setSecciones(res.data.filter(s => s.espacioId === parseInt(selectedEspacio)));
    });
  }, [selectedEspacio]);

  const reloadData = () => {
    if (!selectedSeccion) return setSubsecciones([]);
    axios.get(`/v1/subseccion`, headers).then(res => {
      setSubsecciones(res.data.filter(s => s.seccionId === parseInt(selectedSeccion)));
    });
  };

  useEffect(() => { reloadData(); }, [selectedSeccion]);

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar la subsección "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/subseccion/${selectedRow.id}`, headers);
        setMessage({ open: true, severity: "success", text: "Subsección eliminada correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar subsección." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Subsecciones</Typography>

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
      }, {
        label: "Sección", value: selectedSeccion, setValue: setSelectedSeccion, items: secciones, disabled: !selectedEspacio
      }].map(({ label, value, setValue, items, disabled }, i) => (
        <FormControl key={i} fullWidth sx={{ mb: 2 }} disabled={disabled}>
          <InputLabel>{label}</InputLabel>
          <Select value={value} onChange={e => setValue(e.target.value)} label={label}>
            {items.map(opt => <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>)}
          </Select>
        </FormControl>
      ))}

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }} disabled={!selectedSeccion}>+ Agregar Subsección</Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>Editar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>Eliminar</Button>
      </Box>

      <GridSubseccion subsecciones={subsecciones} setSelectedRow={setSelectedRow} />

      <FormSubseccion
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        seccionId={selectedSeccion}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
