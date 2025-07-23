import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Box
} from "@mui/material";

import axios from "../axiosConfig";

export default function FormKardex({
  open, setOpen, formMode = "create",
  selectedRow = null, reloadData, setMessage, setSelectedRow, setFormMode
}) {
  const [formData, setFormData] = useState({
    fechaHora: "",
    almacenId: "",
    produccionId: "",
    tipoMovimientoId: "",
    descripcion: "",
    estadoId: 1,
    empresaId: null
  });

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [tiposMovimiento, setTiposMovimiento] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const empresaId = JSON.parse(atob(token.split('.')[1])).empresaId;

  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data));
    //axios.get("/v1/produccion", headers).then(res => setProducciones(res.data));
    axios.get("/v1/tipo_movimiento", headers)
  .then(res => {
    console.log("Respuesta de /v1/tipo_movimiento:", res.data); 

    if (Array.isArray(res.data)) {
      setTiposMovimiento(res.data);
    } else if (Array.isArray(res.data.data)) {
      setTiposMovimiento(res.data.data);
    } else {
      console.error("Respuesta inesperada para tiposMovimiento:", res.data);
      setTiposMovimiento([]);
    }
  })
  .catch(err => {
    console.error("Error al cargar tipos de movimiento:", err);
    setTiposMovimiento([]);
  });


  }, []);

  useEffect(() => {
    if (open && formMode === "edit" && selectedRow) {
      setFormData({ ...selectedRow, empresaId });
    } else {
      setFormData({
        fechaHora: "",
        almacenId: "",
        produccionId: "",
        tipoMovimientoId: "",
        descripcion: "",
        estadoId: 1,
        empresaId
      });
    }
  }, [open]);

  useEffect(() => {
    setDepartamentos([]); setSelectedDepto("");
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers).then(res => {
      setDepartamentos(res.data.filter(dep => dep.paisId === parseInt(selectedPais)));
    });
  }, [selectedPais]);

  useEffect(() => {
    setMunicipios([]); setSelectedMunicipio("");
    if (!selectedDepto) return;
    axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => {
      setMunicipios(res.data);
    });
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]); setSelectedSede("");
    if (!selectedMunicipio) return;
    axios.get("/v1/sede", headers).then(res => {
      setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
    });
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]); setSelectedBloque("");
    if (!selectedSede) return;
    axios.get("/v1/bloque", headers).then(res => {
      setBloques(res.data.filter(b => b.sedeId === parseInt(selectedSede)));
    });
  }, [selectedSede]);

  useEffect(() => {
    setEspacios([]); setSelectedEspacio("");
    if (!selectedBloque) return;
    axios.get("/v1/espacio", headers).then(res => {
      setEspacios(res.data.filter(e => e.bloqueId === parseInt(selectedBloque)));
    });
  }, [selectedBloque]);

  useEffect(() => {
    setAlmacenes([]); setFormData(f => ({ ...f, almacenId: "" }));
    if (!selectedEspacio) return;
    axios.get("/v1/almacen", headers).then(res => {
      setAlmacenes(res.data.filter(a => a.espacioId === parseInt(selectedEspacio)));
    });
  }, [selectedEspacio]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const method = formMode === "edit" ? axios.put : axios.post;
    const url = formMode === "edit" ? `/v1/kardex/${formData.id}` : "/v1/kardex";
    method(url, formData, headers)
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: `Kardex ${formMode === "edit" ? "actualizado" : "creado"}` });
        setOpen(false);
        setSelectedRow(null);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al guardar Kardex" });
      });
  };

  const handleDelete = () => {
    if (!selectedRow?.id) return;
    axios.delete(`/v1/kardex/${selectedRow.id}`, headers)
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: "Kardex eliminado correctamente" });
        setSelectedRow(null);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al eliminar" });
      });
  };

  return (
    <Box>
      <Grid container spacing={2} mb={2}>
        <Grid item>
          <Button variant="contained" onClick={() => { setFormMode("create"); setOpen(true); }}>Nuevo</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" disabled={!selectedRow} onClick={() => { setFormMode("edit"); setOpen(true); }}>Editar</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="error" disabled={!selectedRow} onClick={handleDelete}>Eliminar</Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{formMode === "edit" ? "Editar Kardex" : "Nuevo Kardex"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Fecha/Hora" name="fechaHora" type="datetime-local" value={formData.fechaHora} onChange={handleChange} fullWidth />

          <FormControl fullWidth><InputLabel>País</InputLabel>
            <Select value={selectedPais} onChange={e => setSelectedPais(e.target.value)}>
              {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedPais}><InputLabel>Departamento</InputLabel>
            <Select value={selectedDepto} onChange={e => setSelectedDepto(e.target.value)}>
              {departamentos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedDepto}><InputLabel>Municipio</InputLabel>
            <Select value={selectedMunicipio} onChange={e => setSelectedMunicipio(e.target.value)}>
              {municipios.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedMunicipio}><InputLabel>Sede</InputLabel>
            <Select value={selectedSede} onChange={e => setSelectedSede(e.target.value)}>
              {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedSede}><InputLabel>Bloque</InputLabel>
            <Select value={selectedBloque} onChange={e => setSelectedBloque(e.target.value)}>
              {bloques.map(b => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedBloque}><InputLabel>Espacio</InputLabel>
            <Select value={selectedEspacio} onChange={e => setSelectedEspacio(e.target.value)}>
              {espacios.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedEspacio}><InputLabel>Almacén</InputLabel>
            <Select name="almacenId" value={formData.almacenId} onChange={handleChange}>
              {almacenes.map(a => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Producción</InputLabel>
            <Select name="produccionId" value={formData.produccionId} onChange={handleChange}>
              {producciones.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tipo Movimiento</InputLabel>
            <Select name="tipoMovimientoId" value={formData.tipoMovimientoId} onChange={handleChange}>
              {tiposMovimiento.map(t => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} fullWidth />

          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select name="estadoId" value={formData.estadoId} onChange={handleChange}>
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
