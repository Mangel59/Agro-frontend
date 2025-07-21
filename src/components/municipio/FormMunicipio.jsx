import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormMunicipio({
  open = false,
  setOpen = () => {},
  selectedDepartamento,
  selectedRow = null,
  formMode = "create",
  setMessage,
  reloadData
}) {
  const initialData = {
    nombre: "",
    codigo: "",
    acronimo: "",
    estadoId: 1,
    departamentoId: selectedDepartamento,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, departamentoId: selectedDepartamento });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, selectedDepartamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "estadoId" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (invalidCharsRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre contiene caracteres no permitidos.";
    }

    if (!formData.codigo?.toString().trim()) {
      newErrors.codigo = "El código es obligatorio.";
    } else if (invalidCharsRegex.test(formData.codigo.toString())) {
      newErrors.codigo = "El código contiene caracteres no permitidos.";
    }

    if (!formData.acronimo?.trim()) {
      newErrors.acronimo = "El acrónimo es obligatorio.";
    } else if (invalidCharsRegex.test(formData.acronimo)) {
      newErrors.acronimo = "El acrónimo contiene caracteres no permitidos.";
    }

    if (![0, 1, 2].includes(formData.estadoId)) {
      newErrors.estadoId = "Debe seleccionar un estado válido.";
    }

    if (!formData.departamentoId) {
      newErrors.departamentoId = "Debe seleccionar un departamento.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (formMode === "edit" && selectedRow?.id) {
        await axios.put(`/v1/municipio/${selectedRow.id}`, formData);
        setMessage({
          open: true,
          severity: "success",
          text: "Municipio actualizado correctamente.",
        });
      } else {
        await axios.post("/v1/municipio", formData);
        setMessage({
          open: true,
          severity: "success",
          text: "Municipio creado correctamente.",
        });
      }

      setOpen(false);
      reloadData?.();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar municipio.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Municipio" : "Nuevo Municipio"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
        />
        <TextField
          fullWidth margin="normal" label="Código" name="codigo"
          value={formData.codigo} onChange={handleChange}
          error={!!errors.codigo} helperText={errors.codigo}
        />
        <TextField
          fullWidth margin="normal" label="Acrónimo" name="acronimo"
          value={formData.acronimo} onChange={handleChange}
          error={!!errors.acronimo} helperText={errors.acronimo}
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
