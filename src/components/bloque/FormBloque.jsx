// FormBloque.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormBloque({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  sedeId = "",
  tiposBloque = [],
  reloadData = () => {},
  setMessage = () => {},
}) {
  const initialData = {
    id: null,
    sedeId: sedeId || "",
    tipoBloqueId: "",
    nombre: "",
    numeroPisos: 1,
    descripcion: "",
    estadoId: 1,
    geolocalizacion: "",
    coordenadas: "",
    direccion: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, sedeId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, sedeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoBloqueId) newErrors.tipoBloqueId = "Debe seleccionar un tipo de bloque.";
    if (!formData.sedeId) newErrors.sedeId = "Sede no asignada.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Debe seleccionar estado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/bloque/${formData.id}`, formData);
        setMessage({ open: true, severity: "success", text: "Bloque actualizado correctamente." });
      } else {
        await axios.post("/v1/bloque", formData);
        setMessage({ open: true, severity: "success", text: "Bloque creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar bloque.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Bloque" : "Nuevo Bloque"}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="normal" label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} error={!!errors.nombre} helperText={errors.nombre} />
        <TextField fullWidth margin="normal" label="Número de Pisos" name="numeroPisos" type="number" value={formData.numeroPisos} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Geolocalización" name="geolocalizacion" value={formData.geolocalizacion} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Coordenadas" name="coordenadas" value={formData.coordenadas} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} />

        <FormControl fullWidth margin="normal" error={!!errors.tipoBloqueId}>
          <InputLabel>Tipo de Bloque</InputLabel>
          <Select name="tipoBloqueId" value={formData.tipoBloqueId} onChange={handleChange} label="Tipo de Bloque">
            {tiposBloque.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
            ))}
          </Select>
          {errors.tipoBloqueId && <FormHelperText>{errors.tipoBloqueId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select name="estadoId" value={formData.estadoId} onChange={handleChange} label="Estado">
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
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
