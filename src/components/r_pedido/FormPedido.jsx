import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormPedido({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  almacenId = "",
  reloadData = () => {},
  setMessage = () => {},
}) {
  const [producciones, setProducciones] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const initialData = {
    id: null,
    almacenId: almacenId || "",
    produccionId: "",
    descripcion: "",
    fechaHora: "",
    estadoId: 1,
    empresaId: "", // opcional, si se quiere llenar por token
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("/v1/produccion", headers)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducciones(data);
      })
      .catch(() => setProducciones([]));
  }, []);

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, almacenId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, almacenId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.produccionId) newErrors.produccionId = "Seleccione una producción.";
    if (!formData.fechaHora) newErrors.fechaHora = "La fecha es obligatoria.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Seleccione estado.";
    if (!formData.almacenId) newErrors.almacenId = "Almacén no asignado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/pedido/${formData.id}`, formData, headers);
        setMessage({ open: true, severity: "success", text: "Pedido actualizado correctamente." });
      } else {
        await axios.post("/v1/pedido", formData, headers);
        setMessage({ open: true, severity: "success", text: "Pedido creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar pedido.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Pedido" : "Nuevo Pedido"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!errors.produccionId}>
          <InputLabel>Producción</InputLabel>
          <Select
            name="produccionId"
            value={formData.produccionId}
            onChange={handleChange}
            label="Producción"
          >
            {Array.isArray(producciones) && producciones.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
            ))}
          </Select>
          {errors.produccionId && <FormHelperText>{errors.produccionId}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Fecha y Hora"
          name="fechaHora"
          type="datetime-local"
          value={formData.fechaHora}
          onChange={handleChange}
          error={!!errors.fechaHora}
          helperText={errors.fechaHora}
          InputLabelProps={{ shrink: true }}
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
            <MenuItem value={0}>Inactivo</MenuItem>
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
