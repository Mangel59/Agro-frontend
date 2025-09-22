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
  bloqueId = "",                   // puede venir del filtro
  bloques = [],                    // [{id, nombre}]
  tiposEspacio = [],              // [{id, nombre}]
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {},
}) {
  // ===========================
  // ESTADO Y CONFIGURACIÓN INICIAL
  // ===========================
  const initialData = {
    id: null,
    bloqueId: bloqueId || "",
    tipoEspacioId: "",
    nombre: "",
    descripcion: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [tiposEspacioLocal, setTiposEspacioLocal] = useState([]);

  // ===========================
  // UTILIDADES Y HELPERS
  // ===========================
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  
  const toNum = (v) => (v === "" || v === null || v === undefined ? "" : Number(v));

  // ===========================
  // EFECTOS
  // ===========================
  useEffect(() => {
    if (!tiposEspacio.length) {
      axios.get("/v1/tipo_espacio", authHeaders)
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
        bloqueId: toNum(bloqueId, ""), // si no hay filtro, obligar a elegir
      });
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formMode, selectedRow, bloqueId]);

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    // fuerza numérico en selects clave
    if (["tipoEspacioId", "estadoId", "bloqueId"].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: toNum(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ===========================
  // VALIDACIONES
  // ===========================
  const validate = () => {
    const newErrors = {};
    
    // Validación de nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    
    // Validación de tipo de espacio
    if (!Number(formData.tipoEspacioId)) {
      newErrors.tipoEspacioId = "Debe seleccionar un tipo de espacio.";
    }
    
    // Validación de bloque
    if (!Number(formData.bloqueId)) {
      newErrors.bloqueId = "Debe seleccionar un bloque.";
    }
    
    // Validación de estado
    if (![1, 2].includes(Number(formData.estadoId))) {
      newErrors.estadoId = "Debe seleccionar un estado válido.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===========================
  // PROCESAMIENTO DE DATOS
  // ===========================
  const buildPayload = () => ({
    nombre: formData.nombre.trim(),
    descripcion: formData.descripcion?.trim() || "",
    tipoEspacioId: formData.tipoEspacioId,
    bloqueId: formData.bloqueId,
    estadoId: formData.estadoId, // 1=Activo, 2=Inactivo
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = buildPayload();

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/espacio/${formData.id}`, { id: Number(formData.id), ...payload }, authHeaders);
        setMessage({ open: true, severity: "success", text: "Espacio actualizado correctamente." });
      } else {
        await axios.post("/v1/espacio", payload, authHeaders);
        setMessage({ open: true, severity: "success", text: "Espacio creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      const api = err.response?.data || {};
      setMessage({
        open: true,
        severity: "error",
        text: api.message || api.error || "Error al guardar espacio.",
      });
    }
  };

  // ===========================
  // CONFIGURACIONES AUXILIARES
  // ===========================
  const tipos = tiposEspacio.length ? tiposEspacio : tiposEspacioLocal;

  // ===========================
  // RENDER
  // ===========================
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Espacio" : "Nuevo Espacio"}</DialogTitle>
      
      <DialogContent>
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

        {/* Campo Descripción */}
        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />

        {/* Selector de Bloque (solo si no hay filtro) */}
        {!bloqueId && (
          <FormControl fullWidth margin="normal" error={!!errors.bloqueId}>
            <InputLabel>Bloque</InputLabel>
            <Select
              name="bloqueId"
              value={formData.bloqueId || ""}
              onChange={handleChange}
              label="Bloque"
            >
              {Array.isArray(bloques) && bloques.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>
              ))}
            </Select>
            {errors.bloqueId && <FormHelperText>{errors.bloqueId}</FormHelperText>}
          </FormControl>
        )}

        {/* Selector de Tipo de Espacio */}
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
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
