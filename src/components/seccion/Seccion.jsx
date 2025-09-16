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
  const empresaId = localStorage.getItem("empresaId"); // opcional para filtrar sedes por empresa
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const uniqById = (arr) => Array.from(new Map(arr.map(o => [o.id, o])).values());

  // ===== Carga base
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data || []));
  }, []);

  // ===== País -> Departamentos
  useEffect(() => {
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);

    if (!selectedPais) return;

    axios.get("/v1/departamento", headers).then(res => {
      const list = (res.data || []).filter(d => d.paisId === parseInt(selectedPais));
      setDepartamentos(list);
    });
  }, [selectedPais]);

  // Autoselect Depto
  useEffect(() => {
    if (departamentos.length === 1) setSelectedDepto(String(departamentos[0].id));
  }, [departamentos]);

  // ===== Depto -> Municipios
  useEffect(() => {
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);

    if (!selectedDepto) return;

    axios
      .get(`/v1/municipio?departamentoId=${selectedDepto}`, headers)
      .then(res => setMunicipios(asArray(res.data)))
      .catch(() => setMunicipios([]));
  }, [selectedDepto]);

  // Autoselect Municipio
  useEffect(() => {
    if (municipios.length === 1) setSelectedMunicipio(String(municipios[0].id));
  }, [municipios]);

  // ===== Municipio -> Sedes (robusto, con empresa opcional)
  useEffect(() => {
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);

    if (!selectedMunicipio) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/v1/sede`, headers);
        if (cancelled) return;

        const raw = asArray(res.data);
        const municipioIdNum = Number(selectedMunicipio);
        const empresaIdNum   = empresaId != null && empresaId !== "" ? Number(empresaId) : null;
        const itemsTienenEmpresa = raw.some(s => s.empresaId != null && !Number.isNaN(Number(s.empresaId)));

        const list = raw.filter(s => {
          const sameMunicipio = Number(s.municipioId) === municipioIdNum;
          if (!sameMunicipio) return false;
          if (itemsTienenEmpresa && empresaIdNum != null) {
            return Number(s.empresaId) === empresaIdNum;
          }
          return true;
        });

        setSedes(uniqById(list));
      } catch {
        if (!cancelled) setSedes([]);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedMunicipio, empresaId, token]);

  // Autoselect Sede
  useEffect(() => {
    if (sedes.length === 1) setSelectedSede(String(sedes[0].id));
  }, [sedes]);

  // ===== Sede -> Bloques
  useEffect(() => {
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);

    if (!selectedSede) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers);
        if (cancelled) return;
        let list = asArray(res.data);
        // Si el backend NO filtra por sedeId:
        // list = list.filter(b => String(b.sedeId) === String(selectedSede));
        setBloques(uniqById(list));
      } catch {
        if (!cancelled) setBloques([]);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedSede]);

  // Autoselect Bloque
  useEffect(() => {
    if (bloques.length === 1) setSelectedBloque(String(bloques[0].id));
  }, [bloques]);

  // ===== Bloque -> Espacios
  useEffect(() => {
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);

    if (!selectedBloque) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/v1/espacio?bloqueId=${selectedBloque}`, headers);
        if (cancelled) return;
        let list = asArray(res.data);
        // Si el backend NO filtra por bloqueId:
        // list = list.filter(e => String(e.bloqueId) === String(selectedBloque));
        setEspacios(uniqById(list));
      } catch {
        if (!cancelled) setEspacios([]);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedBloque]);

  // Autoselect Espacio
  useEffect(() => {
    if (espacios.length === 1) setSelectedEspacio(String(espacios[0].id));
  }, [espacios]);

  // ===== Espacio -> Secciones (forzado filtro por espacioId en cliente)
  const reloadData = async () => {
    setSecciones([]);     setSelectedRow(null);
    if (!selectedEspacio) return;

    const espacioActual = String(selectedEspacio);
    let cancelled = false;

    try {
      const res = await axios.get(`/v1/seccion?espacioId=${espacioActual}`, headers);
      if (cancelled) return;

      let list = asArray(res.data);
      // Fuerza filtro por espacioId por si el backend no lo hace
      list = list.filter(s => String(s.espacioId) === espacioActual);
      list = uniqById(list);

      if (String(selectedEspacio) === espacioActual) {
        setSecciones(list);
      }
    } catch {
      if (!cancelled) setSecciones([]);
    }

    return () => { cancelled = true; };
  };

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEspacio]);

  // ===== Handlers (limpian dependientes al vuelo)
  const handlePaisChange = (val) => {
    setSelectedPais(val);
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);
  };

  const handleDeptoChange = (val) => {
    setSelectedDepto(val);
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);
  };

  const handleMunicipioChange = (val) => {
    setSelectedMunicipio(val);
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);
  };

  const handleSedeChange = (val) => {
    setSelectedSede(val);
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);
  };

  const handleBloqueChange = (val) => {
    setSelectedBloque(val);
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedRow(null);
  };

  const handleEspacioChange = (val) => {
    setSelectedEspacio(val);
    setSecciones([]);     setSelectedRow(null);
  };

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

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedBloque}>
        <InputLabel>Espacio</InputLabel>
        <Select value={selectedEspacio} onChange={e => handleEspacioChange(e.target.value)} label="Espacio">
          {espacios.map(e => <MenuItem key={e.id} value={String(e.id)}>{e.nombre}</MenuItem>)}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }}
          disabled={!selectedEspacio}
        >
          + Agregar Sección
        </Button>
        <Button
          variant="outlined"
          onClick={() => { setFormMode("edit"); setFormOpen(true); }}
          disabled={!selectedRow}
        >
          Editar
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>
          Eliminar
        </Button>
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
