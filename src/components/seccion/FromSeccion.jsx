import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig.js";

export default function FormSeccion({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  espacioId = "",
  reloadData = () => {},
  setMessage = () => {},
}) {
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const toNum = (v) =>
    v === "" || v === null || v === undefined ? "" : Number(v);

  const initialData = {
    id: null,
    espacioId: toNum(espacioId) || "",
    nombre: "",
    descripcion: "",
    // 1 = Activo, 2 = Inactivo (recomendado por consistencia con otros formularios)
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        id: selectedRow.id,
        espacioId: toNum(selectedRow.espacioId),
        nombre: selectedRow.nombre ?? "",
        descripcion: selectedRow.descripcion ?? "",
        // si tu backend te devuelve 0 para inactivo, lo mapeamos a 2
        estadoId: selectedRow.estadoId === 0 ? 2 : toNum(selectedRow.estadoId ?? 1),
      });
    } else {
      setFormData({
        ...initialData,
        espacioId: toNum(espacioId),
      });
    }
    setErrors({});
  }, [open, formMode, selectedRow, espacioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["estadoId", "espacioId"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: toNum(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.espacioId) newErrors.espacioId = "Debe seleccionar un espacio.";
    // acepta 1 o 2; rechaza vacío/null/NaN
    if (
      formData.estadoId === "" ||
      formData.estadoId === null ||
      Number.isNaN(Number(formData.estadoId))
    ) {
      newErrors.estadoId = "Debe seleccionar estado.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || "",
      espacioId: formData.espacioId,
      estadoId: formData.estadoId, // 1=Activo, 2=Inactivo
    };

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/seccion/${formData.id}`, payload, headers);
        setMessage({ open: true, severity: "success", text: "Sección actualizada correctamente." });
      } else {
        await axios.post("/v1/seccion", payload, headers);
        setMessage({ open: true, severity: "success", text: "Sección creada correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar sección.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Sección" : "Nueva Sección"}</DialogTitle>
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
