import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormTipoInventario({ open=false, setOpen=()=>{}, formMode="create", selectedRow=null, setMessage, reloadData, authHeaders }) {
  const initialData = {
    nombre: "",
    descripcion: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  // Efecto para actualizar formulario cuando se abre
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        ...selectedRow,
        id: Number(selectedRow.id),
        estadoId: Number(selectedRow.estadoId),
        descripcion: selectedRow.descripcion || "",
      });
    } else {
      setFormData(initialData);
    }
    setErrors({});
  }, [open, formMode, selectedRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "estadoId" ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    else if (invalidCharsRegex.test(formData.nombre)) newErrors.nombre = "El nombre contiene caracteres no permitidos.";

    if (![1, 2].includes(Number(formData.estadoId))) newErrors.estadoId = "Debe seleccionar un estado válido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payloadBase = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || "",
      estadoId: Number(formData.estadoId),
    };

    try {
      if (formMode === "edit" && selectedRow?.id) {
        const payloadEdit = { id: Number(selectedRow.id), ...payloadBase };
        await axios.put(`/v1/tipo_inventario/${selectedRow.id}`, payloadEdit, authHeaders);
        setMessage({ open: true, severity: "success", text: "Tipo de inventario actualizado correctamente." });
      } else {
        await axios.post("/v1/tipo_inventario", payloadBase, authHeaders);
        setMessage({ open: true, severity: "success", text: "Tipo de inventario creado correctamente." });
      }

      setOpen(false);
      reloadData?.();
    } catch (err) {
      console.error("ERR PUT/POST:", err.response?.status, err.response?.data || err.message);
      const txt = err.response?.data?.message || err.response?.data?.error || "Error al guardar tipo de inventario.";
      setMessage({ open: true, severity: "error", text: txt });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Tipo de Inventario" : "Nuevo Tipo de Inventario"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
        />
        <TextField
          fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          multiline rows={3}
        />
        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={2}>Inactivo</MenuItem>
          </Select>
          {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
