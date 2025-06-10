import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormProveedor({
  open = false,
  setOpen = () => {},
  selectedRow = null,
  formMode = "create",
  setMessage,
  reloadData,
  setSelectedRow,
  tiposIdentificacion = []
}) {
  const initialData = {
    nombre: "",
    identificacion: "",
    contacto: "",
    correo: "",
    celular: "",
    empresaId: "",
    tipoIdentificacionId: "",
    estadoId: 1,
    fechaCreacion: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const getLocalDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({
          ...selectedRow,
          fechaCreacion: selectedRow.fechaCreacion?.slice(0, 16) || "",
        });
      } else {
        setFormData({
          ...initialData,
          fechaCreacion: getLocalDateTime(),
        });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "Nombre es obligatorio";
    if (!formData.identificacion?.trim()) newErrors.identificacion = "Identificación es obligatoria";
    if (!formData.tipoIdentificacionId) newErrors.tipoIdentificacionId = "Seleccione un tipo de identificación";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Seleccione un estado";

    if (!formData.celular?.trim()) {
      newErrors.celular = "El celular es obligatorio";
    } else if (!/^\d+$/.test(formData.celular)) {
      newErrors.celular = "El celular debe contener solo números";
    } else if (formData.celular.length < 7) {
      newErrors.celular = "El celular es demasiado corto";
    }

    const isValidFecha = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(formData.fechaCreacion);
    if (!formData.fechaCreacion || !isValidFecha) {
      newErrors.fechaCreacion = "Debe seleccionar una fecha válida";
    }

    // Mostrar errores detallados en consola
    if (Object.keys(newErrors).length > 0) {
      console.warn("Campos inválidos:");
      Object.entries(newErrors).forEach(([campo, mensaje]) => {
        console.warn(`• ${campo}: ${mensaje}`);
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("Datos a enviar:", formData);

    if (!validate()) return;

    try {
      const dataEnviar = {
        ...formData,
        empresaId:
          formData.empresaId ||
          JSON.parse(localStorage.getItem("tokenData"))?.empresaId ||
          0,
        fechaCreacion: new Date(formData.fechaCreacion).toISOString(),
      };

      if (formMode === "edit") {
        await axios.put(`/v1/proveedor/${formData.id}`, dataEnviar);
        setMessage({
          open: true,
          severity: "success",
          text: "Proveedor actualizado correctamente.",
        });
      } else {
        await axios.post("/v1/proveedor", dataEnviar);
        setMessage({
          open: true,
          severity: "success",
          text: "Proveedor creado correctamente.",
        });
      }

      setOpen(false);
      setSelectedRow(null);
      reloadData?.();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar proveedor.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>{formMode === "edit" ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="dense" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
        />
        <TextField
          fullWidth margin="dense" label="Identificación" name="identificacion"
          value={formData.identificacion} onChange={handleChange}
          error={!!errors.identificacion} helperText={errors.identificacion}
        />
        <FormControl fullWidth margin="dense" error={!!errors.tipoIdentificacionId}>
          <InputLabel>Tipo de Identificación</InputLabel>
          <Select
            name="tipoIdentificacionId"
            value={formData.tipoIdentificacionId}
            onChange={handleChange}
            label="Tipo de Identificación"
          >
            {tiposIdentificacion.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.tipoIdentificacionId && (
            <FormHelperText>{errors.tipoIdentificacionId}</FormHelperText>
          )}
        </FormControl>
        <TextField
          fullWidth margin="dense" label="Contacto" name="contacto"
          value={formData.contacto} onChange={handleChange}
        />
        <TextField
          fullWidth margin="dense" label="Correo" name="correo"
          value={formData.correo} onChange={handleChange}
        />
        <TextField
          fullWidth margin="dense" label="Celular" name="celular"
          value={formData.celular} onChange={handleChange}
          error={!!errors.celular} helperText={errors.celular}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Fecha de Creación"
          name="fechaCreacion"
          type="datetime-local"
          value={formData.fechaCreacion}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.fechaCreacion}
          helperText={errors.fechaCreacion}
        />
        <FormControl fullWidth margin="dense" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
            <MenuItem value={2}>Otro</MenuItem>
          </Select>
          {errors.estadoId && (
            <FormHelperText>{errors.estadoId}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
