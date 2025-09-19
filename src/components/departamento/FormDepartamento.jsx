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
  formMode = "create",
  selectedRow = null,
  paisId = "",                     // puede venir del filtro
  paises = [],                     // [{id, nombre}]
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {},
}) {
  // ===========================
  // ESTADO Y CONFIGURACIÓN INICIAL
  // ===========================
  const initialData = {
    nombre: "",
    codigo: "",
    acronimo: "",
    estadoId: 1,
    paisId: paisId || "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // ===========================
  // UTILIDADES Y HELPERS
  // ===========================
  const toNum = (v, def = 0) => (v === null || v === undefined || v === "" ? def : Number(v));
  
  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  // ===========================
  // EFECTOS
  // ===========================
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        id: toNum(selectedRow.id),
        paisId: toNum(selectedRow.paisId || paisId, ""),
        nombre: selectedRow.nombre ?? "",
        codigo: selectedRow.codigo ?? "",
        acronimo: selectedRow.acronimo ?? "",
        estadoId: toNum(selectedRow.estadoId, 1),
      });
    } else {
      setFormData({
        ...initialData,
        paisId: toNum(paisId, ""), // si no hay filtro, obligar a elegir
      });
    }

    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formMode, selectedRow, paisId]);

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (["estadoId", "paisId"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: toNum(value, "") }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===========================
  // VALIDACIONES
  // ===========================
  const validate = () => {
    const newErrors = {};

    // Validación de nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (invalidCharsRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre contiene caracteres no permitidos.";
    }

    // Validación de código
    if (!formData.codigo?.toString().trim()) {
      newErrors.codigo = "El código es obligatorio.";
    } else if (invalidCharsRegex.test(formData.codigo.toString())) {
      newErrors.codigo = "El código contiene caracteres no permitidos.";
    }

    // Validación de acrónimo
    if (!formData.acronimo?.trim()) {
      newErrors.acronimo = "El acrónimo es obligatorio.";
    } else if (invalidCharsRegex.test(formData.acronimo)) {
      newErrors.acronimo = "El acrónimo contiene caracteres no permitidos.";
    }

    // Validación de estado
    if (![1, 2].includes(Number(formData.estadoId))) {
      newErrors.estadoId = "Debe seleccionar un estado válido.";
    }

    // Validación de país
    if (!Number(formData.paisId)) {
      newErrors.paisId = "Debe seleccionar un país.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===========================
  // PROCESAMIENTO DE DATOS
  // ===========================
  const buildPayload = () => ({
    paisId: Number(formData.paisId),
    nombre: formData.nombre.trim(),
    codigo: formData.codigo.toString().trim(),
    acronimo: formData.acronimo.trim(),
    estadoId: Number(formData.estadoId),
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = buildPayload();

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/departamento/${formData.id}`, { id: Number(formData.id), ...payload }, authHeaders);
        setMessage({ open: true, severity: "success", text: "Departamento actualizado correctamente." });
      } else {
        await axios.post("/v1/departamento", payload, authHeaders);
        setMessage({ open: true, severity: "success", text: "Departamento creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      const api = err.response?.data || {};
      setMessage({
        open: true,
        severity: "error",
        text: api.message || api.error || "Error al guardar departamento.",
      });
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formMode === "edit" ? "Editar Departamento" : "Nuevo Departamento"}
      </DialogTitle>
      
      <DialogContent>
        {/* Selector de País (solo si no hay filtro) */}
        {!paisId && (
          <FormControl fullWidth margin="normal" error={!!errors.paisId}>
            <InputLabel>País</InputLabel>
            <Select
              name="paisId"
              value={formData.paisId || ""}
              onChange={handleChange}
              label="País"
            >
              {Array.isArray(paises) && paises.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
              ))}
            </Select>
            {errors.paisId && <FormHelperText>{errors.paisId}</FormHelperText>}
          </FormControl>
        )}

        {/* Campo Nombre */}
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

        {/* Campo Código */}
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

        {/* Campo Acrónimo */}
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

        {/* Selector de Estado */}
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
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
