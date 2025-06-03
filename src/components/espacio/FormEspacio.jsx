import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormEspacio({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  bloqueId = "",
  tiposEspacio = [],
  reloadData = () => {},
  setMessage = () => {},
}) {
  const initialData = {
    id: null,
    bloqueId: bloqueId || "",
    tipoEspacioId: "",
    nombre: "",
    descripcion: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, bloqueId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, bloqueId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoEspacioId) newErrors.tipoEspacioId = "Debe seleccionar un tipo de espacio.";
    if (!formData.bloqueId) newErrors.bloqueId = "Bloque no asignado.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Debe seleccionar estado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/espacio/${formData.id}`, formData);
        setMessage({ open: true, severity: "success", text: "Espacio actualizado correctamente." });
      } else {
        await axios.post("/v1/espacio", formData);
        setMessage({ open: true, severity: "success", text: "Espacio creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar espacio.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Espacio" : "Nuevo Espacio"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="normal"
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          fullWidth margin="normal"
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal" error={!!errors.tipoEspacioId}>
          <InputLabel>Tipo de Espacio</InputLabel>
          <Select
            name="tipoEspacioId"
            value={formData.tipoEspacioId}
            onChange={handleChange}
            label="Tipo de Espacio"
          >
            {tiposEspacio.map(tipo => (
              <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
            ))}
          </Select>
          {errors.tipoEspacioId && <FormHelperText>{errors.tipoEspacioId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            label="Estado"
          >
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
