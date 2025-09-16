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

  // Helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const uniqById = (arr) => Array.from(new Map(arr.map(o => [o.id, o])).values());

  // ===== Cargas base
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data || []));
  }, []);

  // ===== País -> Departamentos
  useEffect(() => {
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers).then(res => {
      const list = (res.data || []).filter(d => d.paisId === parseInt(selectedPais));
      setDepartamentos(list);
    });
  }, [selectedPais]);

  // Autoselect Depto si solo hay uno
  useEffect(() => {
    if (departamentos.length === 1) {
      setSelectedDepto(String(departamentos[0].id));
    }
  }, [departamentos]);

  // ===== Depto -> Municipios
  useEffect(() => {
    if (!selectedDepto) return;
    axios
      .get(`/v1/municipio?departamentoId=${selectedDepto}`, headers)
      .then(res => setMunicipios(asArray(res.data)))
      .catch(() => setMunicipios([]));
  }, [selectedDepto]);

  // Autoselect Municipio si solo hay uno
  useEffect(() => {
    if (municipios.length === 1) {
      setSelectedMunicipio(String(municipios[0].id));
    }
  }, [municipios]);

  // ===== Municipio -> Sedes (robusto: como Bloque, empresa opcional)
  useEffect(() => {
    // limpiar dependientes
    setSedes([]);
    setSelectedSede("");
    setBloques([]);
    setSelectedBloque("");
    setEspacios([]);
    setSelectedRow(null);

    if (!selectedMunicipio) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/v1/sede`, headers);
        if (cancelled) return;

        const raw = asArray(res.data);

        const municipioIdNum = Number(selectedMunicipio);
        const empresaIdNum   = empresaId != null && empresaId !== "" ? Number(empresaId) : null;

        // ¿Los items traen empresaId válido?
        const itemsTienenEmpresa = raw.some(s => s.empresaId != null && !Number.isNaN(Number(s.empresaId)));

        const list = raw.filter(s => {
          const sameMunicipio = Number(s.municipioId) === municipioIdNum;
          if (!sameMunicipio) return false;
          if (itemsTienenEmpresa && empresaIdNum != null) {
            return Number(s.empresaId) === empresaIdNum;
          }
          // si no hay empresa en los datos, no filtramos por empresa
          return true;
        });

        setSedes(uniqById(list));
      } catch (err) {
        console.error("ERROR SEDE", err.response?.status, err.response?.data);
        setSedes([]);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedMunicipio, empresaId, token]);

  // Autoselect Sede si solo hay una
  useEffect(() => {
    if (sedes.length === 1) setSelectedSede(String(sedes[0].id));
  }, [sedes]);

  // ===== Sede -> Bloques
  useEffect(() => {
    setBloques([]);
    setSelectedBloque("");
    setEspacios([]);
    setSelectedRow(null);

    if (!selectedSede) return;

    axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers)
      .then(res => {
        let list = asArray(res.data);
        setBloques(uniqById(list));
      })
      .catch(() => setBloques([]));
  }, [selectedSede]);

  // Autoselect Bloque si solo hay uno
  useEffect(() => {
    if (bloques.length === 1) {
      setSelectedBloque(String(bloques[0].id));
    }
  }, [bloques]);

  // ===== Bloque -> Espacios
  const reloadData = async () => {
    setEspacios([]);
    setSelectedRow(null);

    if (!selectedBloque) return;

    try {
      const res = await axios.get(`/v1/espacio?bloqueId=${selectedBloque}`, headers);
      let list = asArray(res.data);
      setEspacios(uniqById(list));
    } catch {
      setEspacios([]);
    }
  };

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBloque]);

  // ===== Handlers
  const handlePaisChange = (val) => {
    setSelectedPais(val);
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedRow(null);
  };

  const handleDeptoChange = (val) => {
    setSelectedDepto(val);
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedRow(null);
  };

  const handleMunicipioChange = (val) => {
    setSelectedMunicipio(val);
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedRow(null);
  };

  const handleSedeChange = (val) => {
    setSelectedSede(val);
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedRow(null);
  };

  const handleBloqueChange = (val) => {
    setSelectedBloque(val);
    setEspacios([]);      setSelectedRow(null);
  };

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

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedSede}>
        <InputLabel>Bloque</InputLabel>
        <Select value={selectedBloque} onChange={e => handleBloqueChange(e.target.value)} label="Bloque">
          {bloques.map(b => <MenuItem key={b.id} value={String(b.id)}>{b.nombre}</MenuItem>)}
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
