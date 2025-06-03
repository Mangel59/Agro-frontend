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
  const [tiposEspacio, setTiposEspacio] = useState([]);

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
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data));
    axios.get("/v1/tipo_espacio", headers).then(res => setTiposEspacio(res.data));
  }, []);

  useEffect(() => {
    if (selectedPais) {
      axios.get("/v1/departamento", headers).then(res => {
        setDepartamentos(res.data.filter(d => d.paisId === parseInt(selectedPais)));
      });
    } else {
      setDepartamentos([]);
      setSelectedDepto("");
      setSelectedMunicipio("");
      setSelectedSede("");
      setSelectedBloque("");
      setEspacios([]);
    }
  }, [selectedPais]);

  useEffect(() => {
    if (selectedDepto) {
      axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => setMunicipios(res.data));
    } else {
      setMunicipios([]);
      setSelectedMunicipio("");
      setSelectedSede("");
      setSelectedBloque("");
      setEspacios([]);
    }
  }, [selectedDepto]);

  useEffect(() => {
    if (selectedMunicipio) {
      axios.get(`/v1/sede`, headers).then(res => {
        setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
      });
    } else {
      setSedes([]);
      setSelectedSede("");
      setSelectedBloque("");
      setEspacios([]);
    }
  }, [selectedMunicipio]);

  useEffect(() => {
    if (selectedSede) {
      axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers).then(res => setBloques(res.data));
    } else {
      setBloques([]);
      setSelectedBloque("");
      setEspacios([]);
    }
  }, [selectedSede]);

  const reloadData = () => {
    if (!selectedPais || !selectedDepto || !selectedMunicipio || !selectedSede || !selectedBloque) {
      setEspacios([]);
      return;
    }

    axios.get(`/v1/espacio`, headers).then(res => {
      const filtrados = res.data.filter(e => e.bloqueId === parseInt(selectedBloque));
      setEspacios(filtrados);
    });
  };

  useEffect(() => { reloadData(); }, [selectedBloque]);

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

      {/* Filtros en cascada con reseteo */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>País</InputLabel>
        <Select
          value={selectedPais}
          onChange={(e) => {
            setSelectedPais(e.target.value);
            setSelectedDepto("");
            setSelectedMunicipio("");
            setSelectedSede("");
            setSelectedBloque("");
            setEspacios([]);
          }}
          label="País"
        >
          {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPais}>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={selectedDepto}
          onChange={(e) => {
            setSelectedDepto(e.target.value);
            setSelectedMunicipio("");
            setSelectedSede("");
            setSelectedBloque("");
            setEspacios([]);
          }}
          label="Departamento"
        >
          {departamentos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedDepto}>
        <InputLabel>Municipio</InputLabel>
        <Select
          value={selectedMunicipio}
          onChange={(e) => {
            setSelectedMunicipio(e.target.value);
            setSelectedSede("");
            setSelectedBloque("");
            setEspacios([]);
          }}
          label="Municipio"
        >
          {municipios.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedMunicipio}>
        <InputLabel>Sede</InputLabel>
        <Select
          value={selectedSede}
          onChange={(e) => {
            setSelectedSede(e.target.value);
            setSelectedBloque("");
            setEspacios([]);
          }}
          label="Sede"
        >
          {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedSede}>
        <InputLabel>Bloque</InputLabel>
        <Select
          value={selectedBloque}
          onChange={(e) => {
            setSelectedBloque(e.target.value);
            setEspacios([]); // limpio tabla al cambiar bloque
          }}
          label="Bloque"
        >
          {bloques.map(b => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Botones de acción */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setFormMode("create");
            setFormOpen(true);
            setSelectedRow(null);
          }}
          disabled={!selectedBloque}
        >
          + Agregar Espacio
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
          disabled={!selectedRow}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={!selectedRow}
        >
          Eliminar
        </Button>
      </Box>

      {/* Tabla */}
      <GridEspacio espacios={espacios} setSelectedRow={setSelectedRow} />

      {/* Formulario */}
      <FormEspacio
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        bloqueId={selectedBloque}
        tiposEspacio={tiposEspacio}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
