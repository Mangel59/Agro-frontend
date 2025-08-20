import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormProduccion({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  reloadData = () => {},
  setMessage = () => {},
}) {
  const initialForm = {
    id: undefined,
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFinal: "",
    tipoProduccionId: "",
    espacioId: "",
    subSeccionId: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialForm);

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);
  const [subsecciones, setSubsecciones] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Helper para respuestas paginadas o planas
  const takeList = (data) =>
    Array.isArray(data) ? data :
    Array.isArray(data?.content) ? data.content :
    Array.isArray(data?.data) ? data.data : [];

  // Prefill al abrir
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      const toLocal = (iso) => (iso || "").replace("Z", "").slice(0, 16);
      setFormData({
        id: selectedRow.id,
        nombre: selectedRow.nombre ?? "",
        descripcion: selectedRow.descripcion ?? "",
        fechaInicio: toLocal(selectedRow.fechaInicio),
        fechaFinal: toLocal(selectedRow.fechaFinal),
        tipoProduccionId: selectedRow.tipoProduccionId ?? "",
        espacioId: selectedRow.espacioId ?? "",
        subSeccionId: selectedRow.subSeccionId ?? "",
        estadoId: selectedRow.estadoId ?? 1,
      });
    } else {
      setFormData(initialForm);
      setSelectedPais("");
      setSelectedDepto("");
      setSelectedMunicipio("");
      setSelectedSede("");
      setSelectedBloque("");
    }
    setErrors({});
  }, [open, formMode, selectedRow]);

  // Carga catálogos
  useEffect(() => {
    axios.get("/v1/pais", headers)
      .then(res => setPaises(takeList(res.data))).catch(() => setPaises([]));

    axios.get("/v1/tipo_produccion", headers)
      .then(res => setTiposProduccion(takeList(res.data))).catch(() => setTiposProduccion([]));

    axios.get("/v1/subseccion", headers)
      .then(res => setSubsecciones(takeList(res.data))).catch(() => setSubsecciones([]));
  }, []);

  // Cascadas
  useEffect(() => {
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]); setSelectedMunicipio("");
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers)
      .then(res => setDepartamentos(takeList(res.data).filter(d => d.paisId === Number(selectedPais))))
      .catch(() => setDepartamentos([]));
  }, [selectedPais]);

  useEffect(() => {
    setMunicipios([]); setSelectedMunicipio("");
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedDepto) return;
    axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers)
      .then(res => setMunicipios(takeList(res.data))).catch(() => setMunicipios([]));
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedMunicipio) return;
    axios.get("/v1/sede", headers)
      .then(res => setSedes(takeList(res.data).filter(s => s.municipioId === Number(selectedMunicipio))))
      .catch(() => setSedes([]));
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedSede) return;
    axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers)
      .then(res => setBloques(takeList(res.data))).catch(() => setBloques([]));
  }, [selectedSede]);

  useEffect(() => {
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedBloque) return;
    axios.get(`/v1/espacio?bloqueId=${selectedBloque}`, headers)
      .then(res => setEspacios(takeList(res.data))).catch(() => setEspacios([]));
  }, [selectedBloque]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = "Obligatorio";
    if (!formData.tipoProduccionId) e.tipoProduccionId = "Obligatorio";
    if (!formData.fechaInicio) e.fechaInicio = "Obligatorio";
    if (!formData.fechaFinal) e.fechaFinal = "Obligatorio";
    if (!formData.espacioId) e.espacioId = "Obligatorio";
    if (!formData.subSeccionId) e.subSeccionId = "Obligatorio";
    if (!formData.estadoId) e.estadoId = "Obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fixDate = (val) => (val ? `${val}:00` : "");

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      tipoProduccionId: Number(formData.tipoProduccionId),
      espacioId: Number(formData.espacioId),
      subSeccionId: Number(formData.subSeccionId),
      estadoId: Number(formData.estadoId),
      fechaInicio: fixDate(formData.fechaInicio),
      fechaFinal: fixDate(formData.fechaFinal),
    };

    const method = formMode === "edit" ? axios.put : axios.post;
    const url = formMode === "edit" ? `/v1/produccion/${formData.id}` : "/v1/produccion";

    try {
      await method(url, payload, headers);
      reloadData();
      setMessage({ open: true, severity: "success", text: `Producción ${formMode === "edit" ? "actualizada" : "creada"}` });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setMessage({ open: true, severity: "error", text: "Error al guardar producción" });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Producción" : "Nueva Producción"}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Nombre" name="nombre" value={formData.nombre}
          onChange={handleChange} error={!!errors.nombre} helperText={errors.nombre} fullWidth
        />

        <FormControl fullWidth error={!!errors.tipoProduccionId}>
          <InputLabel>Tipo Producción</InputLabel>
          <Select name="tipoProduccionId" value={formData.tipoProduccionId} label="Tipo Producción" onChange={handleChange}>
            {tiposProduccion.map(tp => <MenuItem key={tp.id} value={tp.id}>{tp.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} fullWidth />

        <TextField
          label="Fecha Inicio" name="fechaInicio" type="datetime-local"
          value={formData.fechaInicio} onChange={handleChange}
          error={!!errors.fechaInicio} helperText={errors.fechaInicio}
          fullWidth InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha Final" name="fechaFinal" type="datetime-local"
          value={formData.fechaFinal} onChange={handleChange}
          error={!!errors.fechaFinal} helperText={errors.fechaFinal}
          fullWidth InputLabelProps={{ shrink: true }}
        />

        {/* Cascada de espacio */}
        <FormControl fullWidth>
          <InputLabel>País</InputLabel>
          <Select value={selectedPais} label="País" onChange={(e) => setSelectedPais(e.target.value)}>
            {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedPais}>
          <InputLabel>Departamento</InputLabel>
          <Select value={selectedDepto} label="Departamento" onChange={(e) => setSelectedDepto(e.target.value)}>
            {departamentos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedDepto}>
          <InputLabel>Municipio</InputLabel>
          <Select value={selectedMunicipio} label="Municipio" onChange={(e) => setSelectedMunicipio(e.target.value)}>
            {municipios.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedMunicipio}>
          <InputLabel>Sede</InputLabel>
          <Select value={selectedSede} label="Sede" onChange={(e) => setSelectedSede(e.target.value)}>
            {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedSede}>
          <InputLabel>Bloque</InputLabel>
          <Select value={selectedBloque} label="Bloque" onChange={(e) => setSelectedBloque(e.target.value)}>
            {bloques.map(b => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedBloque} error={!!errors.espacioId}>
          <InputLabel>Espacio</InputLabel>
          <Select name="espacioId" value={formData.espacioId} label="Espacio" onChange={handleChange}>
            {espacios.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth error={!!errors.subSeccionId}>
          <InputLabel>Subsección</InputLabel>
          <Select name="subSeccionId" value={formData.subSeccionId} label="Subsección" onChange={handleChange}>
            {subsecciones.map(ss => <MenuItem key={ss.id} value={ss.id}>{ss.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select name="estadoId" value={formData.estadoId} label="Estado" onChange={handleChange}>
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={2}>Inactivo</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
