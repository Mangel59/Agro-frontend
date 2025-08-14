import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig.js";

export default function FormInventario({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  subseccionId = "",
  reloadData = () => {},
  setMessage = () => {},
}) {
  const initialData = {
    id: null,
    subseccionId: subseccionId || "",
    tipoInventarioId: "",
    nombre: "",
    descripcion: "",
    fechaHora: new Date().toISOString().slice(0, 16),
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [tipos, setTipos] = useState([]);

axios.get("/v1/tipo_inventario")
  .then(res => {
    const data = Array.isArray(res.data) ? res.data : [];
    setTipos(data);
  })
  .catch(() => setTipos([]));


  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, subseccionId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, subseccionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoInventarioId) newErrors.tipoInventarioId = "Debe seleccionar un tipo de inventario.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Debe seleccionar estado.";
    if (!formData.subseccionId) newErrors.subseccionId = "Debe seleccionar una subsección.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/inventario/${formData.id}`, formData);
        setMessage({ open: true, severity: "success", text: "Inventario actualizado correctamente." });
      } else {
        await axios.post("/v1/inventario", formData);
        setMessage({ open: true, severity: "success", text: "Inventario creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar inventario.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Inventario" : "Nuevo Inventario"}</DialogTitle>
      <DialogContent>

        <TextField
          fullWidth margin="normal" label="Fecha y Hora" name="fechaHora"
          type="datetime-local"
          value={formData.fechaHora} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
        />

         <FormControl fullWidth margin="normal" error={!!errors.tipoInventarioId}>
          <InputLabel>Tipo de Inventario</InputLabel>
          <Select
            name="tipoInventarioId"
            value={formData.tipoInventarioId}
            onChange={handleChange}
            label="Tipo de Inventario"
          >
            {tipos.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
            ))}
          </Select>
          {errors.tipoInventarioId && (
            <FormHelperText>{errors.tipoInventarioId}</FormHelperText>
          )}
        </FormControl>
        <TextField
          fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
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

FormInventario.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  formMode: PropTypes.string,
  selectedRow: PropTypes.object,
  subseccionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reloadData: PropTypes.func,
  setMessage: PropTypes.func,
};
