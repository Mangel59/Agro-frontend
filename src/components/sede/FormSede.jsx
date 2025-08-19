import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormSede({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  municipioId = "",
  grupos = [],
  tiposSede = [],
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {},
}) {
  const initialData = {
    id: null,
    grupoId: "",
    tipoSedeId: "",
    nombre: "",
    municipioId: municipioId || "",
    geolocalizacion: "",
    coordenadas: "",
    area: "",           // string en el input; se castea al enviar
    comuna: "",
    descripcion: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  // Forzar tipos al abrir
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        ...selectedRow,
        id: Number(selectedRow.id),
        grupoId: Number(selectedRow.grupoId),
        tipoSedeId: Number(selectedRow.tipoSedeId),
        municipioId: Number(selectedRow.municipioId),
        estadoId: Number(selectedRow.estadoId),
        area: selectedRow.area ?? "",
      });
    } else {
      setFormData({
        ...initialData,
        municipioId: Number(municipioId || 0),
      });
    }
    setErrors({});
  }, [open, formMode, selectedRow, municipioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      ["estadoId", "grupoId", "tipoSedeId"].includes(name)
        ? Number(value)
        : name === "area"
        ? value.replace(",", ".")
        : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const e = {};

    if (!formData.nombre?.trim()) e.nombre = "El nombre es obligatorio.";
    else if (invalidCharsRegex.test(formData.nombre)) e.nombre = "El nombre contiene caracteres no permitidos.";

    if (!Number(formData.grupoId)) e.grupoId = "Debe seleccionar un grupo.";
    if (!Number(formData.tipoSedeId)) e.tipoSedeId = "Debe seleccionar un tipo de sede.";
    if (!Number(formData.municipioId)) e.municipioId = "Municipio no asignado.";

    if (formData.area !== "" && isNaN(Number(String(formData.area)))) e.area = "Área debe ser numérica.";

    if (formData.comuna && invalidCharsRegex.test(formData.comuna)) e.comuna = "La comuna contiene caracteres no permitidos.";
    if (formData.descripcion && invalidCharsRegex.test(formData.descripcion)) e.descripcion = "La descripción contiene caracteres no permitidos.";

    if (![1, 2].includes(Number(formData.estadoId))) e.estadoId = "Debe seleccionar estado.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      grupoId: Number(formData.grupoId),
      tipoSedeId: Number(formData.tipoSedeId),
      nombre: formData.nombre.trim(),
      municipioId: Number(formData.municipioId),
      geolocalizacion: formData.geolocalizacion?.trim() || null,
      coordenadas: formData.coordenadas?.trim() || null,
      area: formData.area === "" ? null : Number(formData.area),
      comuna: formData.comuna?.trim() || null,
      descripcion: formData.descripcion?.trim() || null,
      estadoId: Number(formData.estadoId),
    };

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/sede/${formData.id}`, { id: Number(formData.id), ...payload }, authHeaders);
        setMessage({ open: true, severity: "success", text: "Sede actualizada correctamente." });
      } else {
        await axios.post("/v1/sede", payload, authHeaders);
        setMessage({ open: true, severity: "success", text: "Sede creada correctamente." });
      }

      setOpen(false);
      reloadData();
    } catch (err) {
      console.error("SEDE SAVE ERR:", err.response?.status, err.response?.data || err.message);
      const api = err.response?.data || {};
      const txt =
        api.message ||
        api.error ||
        (err.response?.status === 409 ? "Datos duplicados o restricción de base de datos." : "Error al guardar sede.");
      setMessage({ open: true, severity: "error", text: txt });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Sede" : "Nueva Sede"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
        />

        <FormControl fullWidth margin="normal" error={!!errors.grupoId}>
          <InputLabel>Grupo</InputLabel>
          <Select name="grupoId" value={formData.grupoId || ""} onChange={handleChange} label="Grupo">
            {grupos.map((g) => <MenuItem key={g.id} value={g.id}>{g.nombre}</MenuItem>)}
          </Select>
          {errors.grupoId && <FormHelperText>{errors.grupoId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.tipoSedeId}>
          <InputLabel>Tipo de Sede</InputLabel>
          <Select name="tipoSedeId" value={formData.tipoSedeId || ""} onChange={handleChange} label="Tipo de Sede">
            {tiposSede.map((t) => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}
          </Select>
          {errors.tipoSedeId && <FormHelperText>{errors.tipoSedeId}</FormHelperText>}
        </FormControl>

        <TextField fullWidth margin="normal" label="Geolocalización" name="geolocalizacion"
          value={formData.geolocalizacion} onChange={handleChange} />

        <TextField fullWidth margin="normal" label="Coordenadas" name="coordenadas"
          value={formData.coordenadas} onChange={handleChange} />

        <TextField fullWidth margin="normal" label="Área" name="area"
          value={formData.area} onChange={handleChange}
          error={!!errors.area} helperText={errors.area} />

        <TextField fullWidth margin="normal" label="Comuna" name="comuna"
          value={formData.comuna} onChange={handleChange}
          error={!!errors.comuna} helperText={errors.comuna} />

        <TextField fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          error={!!errors.descripcion} helperText={errors.descripcion} />

        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select name="estadoId" value={formData.estadoId} onChange={handleChange} label="Estado">
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={2}>Inactivo</MenuItem>
          </Select>
          {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
