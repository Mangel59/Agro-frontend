import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormDepartamento({
  open = false,
  setOpen = () => {},
  selectedPais,
  selectedRow = null,
  formMode = "create", // "create" | "edit"
  setMessage,
  reloadData,
}) {
  const initialData = {
    nombre: "",
    codigo: "",
    acronimo: "",
    estadoId: 1,
    paisId: selectedPais,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, paisId: selectedPais });
      }
      setErrors({});
    }
  }, [open, selectedPais, formMode, selectedRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.codigo?.toString().trim()) newErrors.codigo = "El código es obligatorio.";
    if (!formData.acronimo?.trim()) newErrors.acronimo = "El acrónimo es obligatorio.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Debe seleccionar estado.";
    if (!formData.paisId) newErrors.paisId = "Debe seleccionar un país.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (formMode === "edit" && selectedRow?.id) {
        await axios.put(`/v1/departamento/${selectedRow.id}`, formData);
        setMessage({
          open: true,
          severity: "success",
          text: "Departamento actualizado correctamente.",
        });
      } else {
        await axios.post("/v1/departamento", formData);
        setMessage({
          open: true,
          severity: "success",
          text: "Departamento creado correctamente.",
        });
      }

      setOpen(false);
      reloadData?.();
    } catch (err) {
      console.error("Error al enviar:", err.response?.data || err.message);
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar departamento.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formMode === "edit" ? "Editar Departamento" : "Nuevo Departamento"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          error={!!errors.codigo}
          helperText={errors.codigo}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Acrónimo"
          name="acronimo"
          value={formData.acronimo}
          onChange={handleChange}
          error={!!errors.acronimo}
          helperText={errors.acronimo}
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
            <MenuItem value={0}>Inactivo</MenuItem>
          </Select>
          {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
