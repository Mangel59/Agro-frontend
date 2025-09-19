import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormAlmacen({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  espacioId = "",                  // puede venir del filtro
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {},
}) {
  // ===========================
  // ESTADO Y CONFIGURACIÓN INICIAL
  // ===========================
  const initialData = {
    id: null,
    espacioId: espacioId || "",
    nombre: "",
    descripcion: "",
    direccion: "",
    geolocalizacion: "",
    coordenadas: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [espaciosLocal, setEspaciosLocal] = useState([]);

  // ===========================
  // UTILIDADES Y HELPERS
  // ===========================
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };

  // ===========================
  // EFECTOS
  // ===========================
  
  // Cargar espacios solo si no hay espacioId del filtro
  useEffect(() => {
    if (!espacioId && open) {
      axios.get("/v1/espacio", { ...authHeaders, params: { page: 0, size: 2000 } })
        .then(res => setEspaciosLocal(asArray(res.data)))
        .catch(() => setEspaciosLocal([]));
    }
  }, [espacioId, open]);

  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        id: selectedRow.id,
        espacioId: selectedRow.espacioId || espacioId || "",
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        direccion: selectedRow.direccion || "",
        geolocalizacion: selectedRow.geolocalizacion || "",
        coordenadas: selectedRow.coordenadas || "",
        estadoId: selectedRow.estadoId || 1,
      });
    } else {
      setFormData({
        ...initialData,
        espacioId: espacioId || "", // si no hay filtro, obligar a elegir
      });
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formMode, selectedRow, espacioId]);

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    // fuerza numérico en selects clave
    if (["espacioId", "estadoId"].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: Number(value) || "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ===========================
  // VALIDACIONES
  // ===========================
  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  const validate = () => {
    const newErrors = {};

    // Validación de nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (invalidCharsRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre contiene caracteres no permitidos.";
    }

    // Validación de descripción
    if (!formData.descripcion?.trim()) {
      newErrors.descripcion = "La descripción es obligatoria.";
    } else if (invalidCharsRegex.test(formData.descripcion)) {
      newErrors.descripcion = "La descripción contiene caracteres no permitidos.";
    }

    // Validación de dirección
    if (!formData.direccion?.trim()) {
      newErrors.direccion = "La dirección es obligatoria.";
    } else if (invalidCharsRegex.test(formData.direccion)) {
      newErrors.direccion = "La dirección contiene caracteres no permitidos.";
    }

    // Validación de geolocalización
    if (!formData.geolocalizacion?.trim()) {
      newErrors.geolocalizacion = "La geolocalización es obligatoria.";
    } else if (invalidCharsRegex.test(formData.geolocalizacion)) {
      newErrors.geolocalizacion = "La geolocalización contiene caracteres no permitidos.";
    }

    // Validación de coordenadas
    if (!formData.coordenadas?.trim()) {
      newErrors.coordenadas = "Las coordenadas son obligatorias.";
    } else if (invalidCharsRegex.test(formData.coordenadas)) {
      newErrors.coordenadas = "Las coordenadas contienen caracteres no permitidos.";
    }

    // Validación de estado
    if (![1, 2].includes(formData.estadoId)) {
      newErrors.estadoId = "Debe seleccionar un estado válido.";
    }

    // Validación de espacio
    if (!Number(formData.espacioId)) {
      newErrors.espacioId = "Debe seleccionar un espacio.";
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
    direccion: formData.direccion?.trim() || "",
    geolocalizacion: formData.geolocalizacion?.trim() || "",
    coordenadas: formData.coordenadas?.trim() || "",
    espacioId: Number(formData.espacioId),
    estadoId: Number(formData.estadoId),
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = buildPayload();

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/almacen/${formData.id}`, { id: Number(formData.id), ...payload }, authHeaders);
        setMessage({ open: true, severity: "success", text: "Almacén actualizado correctamente." });
      } else {
        await axios.post("/v1/almacen", payload, authHeaders);
        setMessage({ open: true, severity: "success", text: "Almacén creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      const api = err.response?.data || {};
      setMessage({
        open: true,
        severity: "error",
        text: api.message || api.error || "Error al guardar almacén.",
      });
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Almacén" : "Nuevo Almacén"}</DialogTitle>
      
      <DialogContent>
        {/* Selector de Espacio (solo si no hay filtro) */}
        {!espacioId && (
          <FormControl fullWidth margin="normal" error={!!errors.espacioId}>
            <InputLabel>Espacio</InputLabel>
            <Select
              name="espacioId"
              value={formData.espacioId || ""}
              onChange={handleChange}
              label="Espacio"
            >
              {espaciosLocal.map((e) => (
                <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
              ))}
            </Select>
            {errors.espacioId && <FormHelperText>{errors.espacioId}</FormHelperText>}
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

        {/* Campo Descripción */}
        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          error={!!errors.descripcion}
          helperText={errors.descripcion}
        />

        {/* Campo Dirección */}
        <TextField
          fullWidth
          margin="normal"
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          error={!!errors.direccion}
          helperText={errors.direccion}
        />

        {/* Campo Geolocalización */}
        <TextField
          fullWidth
          margin="normal"
          label="Geolocalización"
          name="geolocalizacion"
          value={formData.geolocalizacion}
          onChange={handleChange}
          error={!!errors.geolocalizacion}
          helperText={errors.geolocalizacion}
        />

        {/* Campo Coordenadas */}
        <TextField
          fullWidth
          margin="normal"
          label="Coordenadas"
          name="coordenadas"
          value={formData.coordenadas}
          onChange={handleChange}
          error={!!errors.coordenadas}
          helperText={errors.coordenadas}
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
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
