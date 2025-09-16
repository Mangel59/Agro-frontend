import React, { useEffect, useState } from "react";
import axios from "../axiosConfig.js";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormInventario from "./FormInventario.jsx";
import GridInventario from "./GridInventario.jsx";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid
} from "@mui/material";

export default function Inventario() {
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
  const [selectedSubseccion, setSelectedSubseccion] = useState("");

  const [inventarios, setInventarios] = useState([]);
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
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

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
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

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
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

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
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

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
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

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

  // ===== Espacio -> Secciones
  useEffect(() => {
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

    if (!selectedEspacio) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/v1/seccion?espacioId=${selectedEspacio}`, headers);
        if (cancelled) return;
        let list = asArray(res.data);
        // Si el backend NO filtra por espacioId:
        // list = list.filter(s => String(s.espacioId) === String(selectedEspacio));
        setSecciones(uniqById(list));
      } catch {
        if (!cancelled) setSecciones([]);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedEspacio]);

  // Autoselect Sección
  useEffect(() => {
    if (secciones.length === 1) setSelectedSeccion(String(secciones[0].id));
  }, [secciones]);

  // ===== Sección -> Subsecciones
  useEffect(() => {
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);

    if (!selectedSeccion) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/v1/subseccion?seccionId=${selectedSeccion}`, headers);
        if (cancelled) return;
        let list = asArray(res.data);
        // Si el backend NO filtra por seccionId:
        // list = list.filter(s => String(s.seccionId) === String(selectedSeccion));
        setSubsecciones(uniqById(list));
      } catch {
        if (!cancelled) setSubsecciones([]);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedSeccion]);

  // Autoselect Subsección
  useEffect(() => {
    if (subsecciones.length === 1) setSelectedSubseccion(String(subsecciones[0].id));
  }, [subsecciones]);

  // ===== Subsección -> Inventarios (filtro forzado por subseccionId)
  const reloadData = async () => {
    setInventarios([]);   setSelectedRow(null);
    if (!selectedSubseccion) return;

    const subseccionActual = String(selectedSubseccion);
    let cancelled = false;

    try {
      const res = await axios.get(`/v1/inventario?subseccionId=${subseccionActual}`, headers);
      if (cancelled) return;

      let list = asArray(res.data);
      // Fuerza filtro por subseccionId por si el backend no filtra
      list = list.filter(i => String(i.subseccionId) === subseccionActual);
      // evita duplicados
      list = uniqById(list);

      if (String(selectedSubseccion) === subseccionActual) {
        setInventarios(list);
      }
    } catch {
      if (!cancelled) setInventarios([]);
    }

    return () => { cancelled = true; };
  };

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubseccion]);

  // ===== Handlers (limpian dependientes al vuelo)
  const handlePaisChange = (val) => {
    setSelectedPais(val);
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleDeptoChange = (val) => {
    setSelectedDepto(val);
    setMunicipios([]);    setSelectedMunicipio("");
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleMunicipioChange = (val) => {
    setSelectedMunicipio(val);
    setSedes([]);         setSelectedSede("");
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleSedeChange = (val) => {
    setSelectedSede(val);
    setBloques([]);       setSelectedBloque("");
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleBloqueChange = (val) => {
    setSelectedBloque(val);
    setEspacios([]);      setSelectedEspacio("");
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleEspacioChange = (val) => {
    setSelectedEspacio(val);
    setSecciones([]);     setSelectedSeccion("");
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleSeccionChange = (val) => {
    setSelectedSeccion(val);
    setSubsecciones([]);  setSelectedSubseccion("");
    setInventarios([]);   setSelectedRow(null);
  };

  const handleSubseccionChange = (val) => {
    setSelectedSubseccion(val);
    setInventarios([]);   setSelectedRow(null);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar inventario "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/inventario/${selectedRow.id}`, headers);
        setMessage({ open: true, severity: "success", text: "Inventario eliminado correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar inventario." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Inventarios</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "País", value: selectedPais, setValue: handlePaisChange, items: paises, disabled: false },
          { label: "Departamento", value: selectedDepto, setValue: handleDeptoChange, items: departamentos, disabled: !selectedPais },
          { label: "Municipio", value: selectedMunicipio, setValue: handleMunicipioChange, items: municipios, disabled: !selectedDepto },
          { label: "Sede", value: selectedSede, setValue: handleSedeChange, items: sedes, disabled: !selectedMunicipio },
          { label: "Bloque", value: selectedBloque, setValue: handleBloqueChange, items: bloques, disabled: !selectedSede },
          { label: "Espacio", value: selectedEspacio, setValue: handleEspacioChange, items: espacios, disabled: !selectedBloque },
          { label: "Sección", value: selectedSeccion, setValue: handleSeccionChange, items: secciones, disabled: !selectedEspacio },
          { label: "Subsección", value: selectedSubseccion, setValue: handleSubseccionChange, items: subsecciones, disabled: !selectedSeccion },
        ].map(({ label, value, setValue, items, disabled }, i) => (
          <Grid item xs={12} md={3} key={i}>
            <FormControl fullWidth disabled={disabled}>
              <InputLabel>{label}</InputLabel>
              <Select
                value={value}
                onChange={e => setValue(e.target.value)}
                label={label}
              >
                {items.map(opt => (
                  <MenuItem key={opt.id} value={String(opt.id)}>
                    {opt.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }}
          disabled={!selectedSubseccion}
        >
          + Agregar Inventario
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

      <GridInventario inventarios={inventarios} setSelectedRow={setSelectedRow} />

      <FormInventario
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        subseccionId={selectedSubseccion}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
