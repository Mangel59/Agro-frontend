import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormEspacio({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  bloqueId = "",
  tiposEspacio = [],
  reloadData = () => {},
  setMessage = () => {},
}) {
  // Helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const toNum = (v) => (v === "" || v === null || v === undefined ? "" : Number(v));

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const initialData = {
    id: null,
    bloqueId: bloqueId || "",
    tipoEspacioId: "",
    nombre: "",
    descripcion: "",
    // IMPORTANTE: 1 = Activo, 2 = Inactivo (coincide con lo que suele usar tu backend)
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [tiposEspacioLocal, setTiposEspacioLocal] = useState([]);

  useEffect(() => {
    if (!tiposEspacio.length) {
      axios.get("/v1/tipo_espacio", headers)
        .then(res => setTiposEspacioLocal(asArray(res.data)))
        .catch(() => setTiposEspacioLocal([]));
    }
  }, [tiposEspacio]);

  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      // normaliza numéricos
      setFormData({
        id: selectedRow.id,
        bloqueId: toNum(selectedRow.bloqueId),
        tipoEspacioId: toNum(selectedRow.tipoEspacioId),
        nombre: selectedRow.nombre ?? "",
        descripcion: selectedRow.descripcion ?? "",
        estadoId: toNum(
          // si viene 0 desde atrás, mapeamos a 2 para "Inactivo"
          selectedRow.estadoId === 0 ? 2 : selectedRow.estadoId ?? 1
        ),
      });
    } else {
      setFormData({
        ...initialData,
        bloqueId: toNum(bloqueId),
      });
    }
    setErrors({});
  }, [open, formMode, selectedRow, bloqueId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // fuerza numérico en selects clave
    if (["tipoEspacioId", "estadoId", "bloqueId"].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: toNum(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoEspacioId) newErrors.tipoEspacioId = "Debe seleccionar un tipo de espacio.";
    if (!formData.bloqueId) newErrors.bloqueId = "Bloque no asignado.";
    if (!formData.estadoId) newErrors.estadoId = "Debe seleccionar estado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // payload limpio (por si el backend no admite campos extra)
    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || "",
      tipoEspacioId: formData.tipoEspacioId,
      bloqueId: formData.bloqueId,
      estadoId: formData.estadoId, // 1=Activo, 2=Inactivo
    };

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/espacio/${formData.id}`, payload, headers);
        setMessage({ open: true, severity: "success", text: "Espacio actualizado correctamente." });
      } else {
        await axios.post("/v1/espacio", payload, headers);
        setMessage({ open: true, severity: "success", text: "Espacio creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar espacio.",
      });
    }
  };

  const tipos = tiposEspacio.length ? tiposEspacio : tiposEspacioLocal;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Espacio" : "Nuevo Espacio"}</DialogTitle>
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
        <FormControl fullWidth margin="normal" error={!!errors.tipoEspacioId}>
          <InputLabel>Tipo de Espacio</InputLabel>
          <Select
            name="tipoEspacioId"
            value={formData.tipoEspacioId}
            onChange={handleChange}
            label="Tipo de Espacio"
          >
            {tipos.map(tipo => (
              <MenuItem key={tipo.id} value={Number(tipo.id)}>{tipo.nombre}</MenuItem>
            ))}
          </Select>
          {errors.tipoEspacioId && <FormHelperText>{errors.tipoEspacioId}</FormHelperText>}
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
