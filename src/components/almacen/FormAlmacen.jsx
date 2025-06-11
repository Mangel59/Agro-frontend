import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormAlmacen({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  espacioId = "",
  reloadData = () => {},
  setMessage = () => {},
}) {
  const initialData = {
    id: null,
    espacioId: espacioId || "",
    nombre: "",
    descripcion: "",
    direccion: "",
    geolocalizacion: "",
    coordenadas: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, espacioId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, espacioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Debe seleccionar estado.";
    if (!formData.espacioId) newErrors.espacioId = "Espacio no asignado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/almacen/${formData.id}`, formData);
        setMessage({ open: true, severity: "success", text: "Almacén actualizado correctamente." });
      } else {
        await axios.post("/v1/almacen", formData);
        setMessage({ open: true, severity: "success", text: "Almacén creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar almacén.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Almacén" : "Nuevo Almacén"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
        />

        <TextField
          fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
        />

        <TextField
          fullWidth margin="normal" label="Dirección" name="direccion"
          value={formData.direccion} onChange={handleChange}
        />

        <TextField
          fullWidth margin="normal" label="Geolocalización" name="geolocalizacion"
          value={formData.geolocalizacion} onChange={handleChange}
        />

        <TextField
          fullWidth margin="normal" label="Coordenadas" name="coordenadas"
          value={formData.coordenadas} onChange={handleChange}
        />

        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId" value={formData.estadoId}
            onChange={handleChange} label="Estado"
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
