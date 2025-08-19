import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormBloque from "./FormBloque";
import GridBloque from "./GridBloque";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";

export default function Bloque() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [tiposBloque, setTiposBloque] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const uniqById = (arr) => Array.from(new Map(arr.map(o => [o.id, o])).values());

  // ---- Cargas base
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data || []));
    axios.get("/v1/tipo_bloque", headers).then(res => setTiposBloque(res.data || []));
  }, []);

  // ---- País → Departamentos
  useEffect(() => {
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers).then(res => {
      const list = (res.data || []).filter(d => d.paisId === parseInt(selectedPais));
      setDepartamentos(list);
    });
  }, [selectedPais]);

  // Autoselect Dept si solo hay uno
  useEffect(() => {
    if (departamentos.length === 1) {
      setSelectedDepto(String(departamentos[0].id));
    }
  }, [departamentos]);

  // ---- Depto → Municipios
  useEffect(() => {
    if (!selectedDepto) return;
    axios
      .get(`/v1/municipio?departamentoId=${selectedDepto}`, headers)
      .then(res => setMunicipios(asArray(res.data)))
      .catch(err => console.error("ERROR MUNICIPIO", err.response?.status, err.response?.data));
  }, [selectedDepto]);

  // Autoselect Municipio si solo hay uno
  useEffect(() => {
    if (municipios.length === 1) {
      setSelectedMunicipio(String(municipios[0].id));
    }
  }, [municipios]);

  // ---- Municipio → Sedes
  useEffect(() => {
    setSedes([]);
    setSelectedSede("");
    setBloques([]);
    setSelectedRow(null);

    if (!selectedMunicipio) return;

    axios
      .get(`/v1/sede`, headers)
      .then(res => {
        const filtradas = asArray(res.data).filter(s => s.municipioId === parseInt(selectedMunicipio));
        setSedes(filtradas);
      })
      .catch(err => console.error("ERROR SEDE", err.response?.status, err.response?.data));
  }, [selectedMunicipio]);

  // Autoselect Sede si solo hay una
  useEffect(() => {
    if (sedes.length === 1) {
      setSelectedSede(String(sedes[0].id));
    }
  }, [sedes]);

  // ---- Sede → Bloques
  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSede]);

  const reloadData = async () => {
    // limpiar inmediato para evitar "fantasmas" al cambiar
    setBloques([]);
    setSelectedRow(null);

    if (!selectedSede) return;

    let cancelled = false;
    try {
      const res = await axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers);
      if (cancelled) return;
      let lista = asArray(res.data);

      // Si el backend aún no filtra por sedeId, descomenta:
      // lista = lista.filter(b => b.sedeId === parseInt(selectedSede));

      setBloques(uniqById(lista)); // sin duplicados por id
    } catch (err) {
      if (!cancelled) {
        console.error("ERROR BLOQUE", err.response?.status, err.response?.data);
        setBloques([]);
      }
    }
    return () => { cancelled = true; };
  };

  // ---- Handlers que limpian dependientes al vuelo
  const handlePaisChange = (val) => {
    setSelectedPais(val);
    setDepartamentos([]);
    setSelectedDepto("");
    setMunicipios([]);
    setSelectedMunicipio("");
    setSedes([]);
    setSelectedSede("");
    setBloques([]);
    setSelectedRow(null);
  };

  const handleDeptoChange = (val) => {
    setSelectedDepto(val);
    setMunicipios([]);
    setSelectedMunicipio("");
    setSedes([]);
    setSelectedSede("");
    setBloques([]);
    setSelectedRow(null);
  };

  const handleMunicipioChange = (val) => {
    setSelectedMunicipio(val);
    setSedes([]);
    setSelectedSede("");
    setBloques([]);
    setSelectedRow(null);
  };

  const handleSedeChange = (val) => {
    setSelectedSede(val);
    setBloques([]);      // limpia inmediatamente
    setSelectedRow(null);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar el bloque "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/bloque/${selectedRow.id}`, headers);
        setMessage({ open: true, severity: "success", text: "Bloque eliminado correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar bloque." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Bloque</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>País</InputLabel>
        <Select value={selectedPais} onChange={e => handlePaisChange(e.target.value)} label="País">
          {paises.map(p => <MenuItem key={p.id} value={String(p.id)}>{p.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPais}>
        <InputLabel>Departamento</InputLabel>
        <Select value={selectedDepto} onChange={e => handleDeptoChange(e.target.value)} label="Departamento">
          {departamentos.map(d => <MenuItem key={d.id} value={String(d.id)}>{d.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedDepto}>
        <InputLabel>Municipio</InputLabel>
        <Select value={selectedMunicipio} onChange={e => handleMunicipioChange(e.target.value)} label="Municipio">
          {municipios.map(m => <MenuItem key={m.id} value={String(m.id)}>{m.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedMunicipio}>
        <InputLabel>Sede</InputLabel>
        <Select value={selectedSede} onChange={e => handleSedeChange(e.target.value)} label="Sede">
          {sedes.map(s => <MenuItem key={s.id} value={String(s.id)}>{s.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }} disabled={!selectedSede}>+ Agregar Bloque</Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>Editar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>Eliminar</Button>
      </Box>

      <GridBloque bloques={bloques} setSelectedRow={setSelectedRow} />

      <FormBloque
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        sedeId={selectedSede}
        tiposBloque={tiposBloque}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
