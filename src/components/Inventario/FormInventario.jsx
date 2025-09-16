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
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Helpers
  const toNum = (v) =>
    v === "" || v === null || v === undefined ? "" : Number(v);

  const fmtLocal = (dateish) => {
    const d = dateish ? new Date(dateish) : new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };

  const initialData = {
    id: null,
    subseccionId: toNum(subseccionId) || "",
    tipoInventarioId: "",
    nombre: "",
    descripcion: "",
    fechaHora: fmtLocal(),          // para <input type="datetime-local">
    estadoId: 1,                    // 1=Activo, 2=Inactivo (ajusta si tu backend usa 0/1)
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [tipos, setTipos] = useState([]);

  // Cargar tipos de inventario (una sola vez o cuando se abre si aún no están)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get("/v1/tipo_inventario", headers);
        if (cancelled) return;
        setTipos(asArray(res.data));
      } catch {
        if (!cancelled) setTipos([]);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // carga única; si prefieres al abrir, cambia a [open] y protege con if(open && !tipos.length)

  // Abrir/Editar
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        id: selectedRow.id,
        subseccionId: toNum(selectedRow.subseccionId),
        tipoInventarioId: toNum(selectedRow.tipoInventarioId),
        nombre: selectedRow.nombre ?? "",
        descripcion: selectedRow.descripcion ?? "",
        fechaHora: fmtLocal(selectedRow.fechaHora),
        // si tu backend usa 0 para inactivo, mapea aquí: selectedRow.estadoId === 0 ? 2 : toNum(...)
        estadoId: toNum(selectedRow.estadoId ?? 1),
      });
    } else {
      setFormData({
        ...initialData,
        subseccionId: toNum(subseccionId),
      });
    }
    setErrors({});
  }, [open, formMode, selectedRow, subseccionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["subseccionId", "tipoInventarioId", "estadoId"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: toNum(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoInventarioId) newErrors.tipoInventarioId = "Debe seleccionar un tipo de inventario.";
    if (!formData.subseccionId) newErrors.subseccionId = "Debe seleccionar una subsección.";
    // valida estado (1 o 2); ajusta si usas 0/1
    if (formData.estadoId !== 1 && formData.estadoId !== 2) {
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
      subseccionId: formData.subseccionId,
      tipoInventarioId: formData.tipoInventarioId,
      // Conviene enviar ISO completo si tu API lo espera; si espera local, puedes dejar formData.fechaHora
      fechaHora: new Date(formData.fechaHora).toISOString(),
      estadoId: formData.estadoId, // 1=Activo, 2=Inactivo (cambia si tu backend usa 0/1)
    };

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/inventario/${formData.id}`, payload, headers);
        setMessage({ open: true, severity: "success", text: "Inventario actualizado correctamente." });
      } else {
        await axios.post("/v1/inventario", payload, headers);
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
          fullWidth
          margin="normal"
          label="Fecha y Hora"
          name="fechaHora"
          type="datetime-local"
          value={formData.fechaHora}
          onChange={handleChange}
        />

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

        <FormControl fullWidth margin="normal" error={!!errors.tipoInventarioId}>
          <InputLabel>Tipo de Inventario</InputLabel>
          <Select
            name="tipoInventarioId"
            value={formData.tipoInventarioId}
            onChange={handleChange}
            label="Tipo de Inventario"
          >
            {tipos.map((tipo) => (
              <MenuItem key={tipo.id} value={Number(tipo.id)}>
                {tipo.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.tipoInventarioId && <FormHelperText>{errors.tipoInventarioId}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
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
            {/* Si tu backend usa 0/1, cambia a 0 y 1 aquí y en validate/payload */}
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
