import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormMunicipio({ open=false, setOpen=()=>{}, selectedDepartamento, selectedRow=null, formMode="create", setMessage, reloadData }) {
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

  // 👉 Forzar tipos al abrir y separar casos de create/edit
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        ...selectedRow,
        id: Number(selectedRow.id),
        departamentoId: Number(selectedRow.departamentoId),
        estadoId: Number(selectedRow.estadoId),
        codigo: String(selectedRow.codigo ?? ""), // para el TextField
      });
    } else {
      setFormData({
        ...initialData,
        departamentoId: Number(selectedDepartamento || 0),
      });
    }
    setErrors({});
  }, [open, formMode, selectedRow, selectedDepartamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "estadoId" ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    else if (invalidCharsRegex.test(formData.nombre)) newErrors.nombre = "El nombre contiene caracteres no permitidos.";

    if (formData.codigo === "" || isNaN(Number(formData.codigo))) {
      newErrors.codigo = "El código es obligatorio y numérico.";
    }

    if (!formData.acronimo?.trim()) newErrors.acronimo = "El acrónimo es obligatorio.";
    else if (invalidCharsRegex.test(formData.acronimo)) newErrors.acronimo = "El acrónimo contiene caracteres no permitidos.";

    if (![1, 2].includes(Number(formData.estadoId))) newErrors.estadoId = "Debe seleccionar un estado válido.";

    if (!Number(formData.departamentoId)) newErrors.departamentoId = "Debe seleccionar un departamento.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payloadBase = {
      nombre: formData.nombre.trim(),
      departamentoId: Number(formData.departamentoId),
      codigo: Number(formData.codigo),
      acronimo: formData.acronimo.trim(),
      estadoId: Number(formData.estadoId),
    };

    // ✅ Duplicados: crear -> valida todo | editar -> excluye su propio id
    const cache = window.__MUN_CACHE || [];
    const exists = (lista, field, val, excludeId = null) =>
      (lista || []).some(m =>
        String(m[field]).toLowerCase() === String(val).toLowerCase() &&
        (excludeId == null || Number(m.id) !== Number(excludeId))
      );

    if (formMode === "create") {
      if (exists(cache, "nombre", formData.nombre)) {
        setMessage({ open: true, severity: "error", text: "Ya existe un municipio con ese nombre." });
        return;
      }
      if (exists(cache, "codigo", formData.codigo)) {
        setMessage({ open: true, severity: "error", text: "Ya existe un municipio con ese código." });
        return;
      }
    } else if (formMode === "edit" && selectedRow?.id) {
      if (exists(cache, "nombre", formData.nombre, selectedRow.id)) {
        setMessage({ open: true, severity: "error", text: "Ese nombre ya está usado por otro municipio." });
        return;
      }
      if (exists(cache, "codigo", formData.codigo, selectedRow.id)) {
        setMessage({ open: true, severity: "error", text: "Ese código ya está usado por otro municipio." });
        return;
      }
    }

    try {
      if (formMode === "edit" && selectedRow?.id) {
        // 👉 muchos backends exigen el id en el body
        const payloadEdit = { id: Number(selectedRow.id), ...payloadBase };
        await axios.put(`/v1/municipio/${selectedRow.id}`, payloadEdit);
        setMessage({ open: true, severity: "success", text: "Municipio actualizado correctamente." });
      } else {
        await axios.post("/v1/municipio", payloadBase);
        setMessage({ open: true, severity: "success", text: "Municipio creado correctamente." });
      }

      setOpen(false);
      reloadData?.();
    } catch (err) {
      console.error("ERR PUT/POST:", err.response?.status, err.response?.data || err.message);

      // Mensaje más explícito cuando la BD rechaza (409)
      const txt =
        err.response?.status === 409
          ? "No se pudo actualizar: hay un dato duplicado (nombre o código) o una restricción de la base de datos."
          : err.response?.data?.message || err.response?.data?.error || "Error al guardar municipio.";

      setMessage({ open: true, severity: "error", text: txt });
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
