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
}) {
  const initialData = {
    id: null,
    grupoId: "",
    tipoSedeId: "",
    nombre: "",
    municipioId: municipioId || "",
    area: "",
    comuna: "",
    descripcion: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, municipioId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, municipioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      ["estadoId", "grupoId", "tipoSedeId"].includes(name) ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (invalidCharsRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre contiene caracteres no permitidos.";
    }

    if (formData.area && invalidCharsRegex.test(formData.area)) {
      newErrors.area = "El área contiene caracteres no permitidos.";
    }

    if (formData.comuna && invalidCharsRegex.test(formData.comuna)) {
      newErrors.comuna = "La comuna contiene caracteres no permitidos.";
    }

    if (formData.descripcion && invalidCharsRegex.test(formData.descripcion)) {
      newErrors.descripcion = "La descripción contiene caracteres no permitidos.";
    }

    if (!formData.grupoId) {
      newErrors.grupoId = "Debe seleccionar un grupo.";
    }

    if (!formData.tipoSedeId) {
      newErrors.tipoSedeId = "Debe seleccionar un tipo de sede.";
    }

    if (!formData.municipioId) {
      newErrors.municipioId = "Municipio no asignado.";
    }

    if (![0, 1, 2].includes(formData.estadoId)) {
      newErrors.estadoId = "Debe seleccionar estado.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/sede/${formData.id}`, formData);
        setMessage({ open: true, severity: "success", text: "Sede actualizada correctamente." });
      } else {
        await axios.post("/v1/sede", formData);
        setMessage({ open: true, severity: "success", text: "Sede creada correctamente." });
      }

      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar sede.",
      });
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

        <TextField
          fullWidth margin="normal" label="Área" name="area"
          value={formData.area} onChange={handleChange}
          error={!!errors.area} helperText={errors.area}
        />

        <TextField
          fullWidth margin="normal" label="Comuna" name="comuna"
          value={formData.comuna} onChange={handleChange}
          error={!!errors.comuna} helperText={errors.comuna}
        />

        <TextField
          fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          error={!!errors.descripcion} helperText={errors.descripcion}
        />

        <FormControl fullWidth margin="normal" error={!!errors.tipoSedeId}>
          <InputLabel>Tipo de Sede</InputLabel>
          <Select
            name="tipoSedeId"
            value={formData.tipoSedeId || ""}
            onChange={handleChange}
            label="Tipo de Sede"
          >
            {tiposSede.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.tipoSedeId && <FormHelperText>{errors.tipoSedeId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.grupoId}>
          <InputLabel>Grupo</InputLabel>
          <Select
            name="grupoId"
            value={formData.grupoId || ""}
            onChange={handleChange}
            label="Grupo"
          >
            {grupos.map((grupo) => (
              <MenuItem key={grupo.id} value={grupo.id}>
                {grupo.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.grupoId && <FormHelperText>{errors.grupoId}</FormHelperText>}
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
