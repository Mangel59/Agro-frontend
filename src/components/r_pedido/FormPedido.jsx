// FormPedido.jsx (almacén independiente, fix: name y normalización)
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
  const [almacenes, setAlmacenes] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const initialData = {
    id: null,
    almacenId: almacenId || "",
    produccionId: "",
    descripcion: "",
    fechaHora: "",
    estadoId: 1,
    empresaId: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Normalizador "a prueba de todo"
  const toArray = (d) => {
    if (Array.isArray(d)) return d;
    if (!d || typeof d !== "object") return [];
    return d.content ?? d.items ?? d.data ?? d.results ?? [];
  };

useEffect(() => {
  const toArray = (d) => (Array.isArray(d) ? d : (d?.content ?? d?.items ?? d?.data ?? d?.results ?? []));
  const loadCombos = async () => {
    try {
      setLoadingCombos(true);
      const [resAlm, resProd] = await Promise.all([
        axios.get("/v1/items/almacen/0", headers),     // <— SLASH INICIAL
        axios.get("/v1/items/produccion/0", headers),  // <— SLASH INICIAL
      ]);
      setAlmacenes(toArray(resAlm.data));
      setProducciones(toArray(resProd.data));
    } catch (e) {
      console.error("Error combos", e?.response?.status, e?.config?.url, e?.response?.data);
      setAlmacenes([]);
      setProducciones([]);
      setMessage({
        open: true, severity: "error",
        text: `No se pudieron cargar Almacenes/Producciones${e?.response?.status ? ` (${e.response.status})` : ""}.`
      });
    } finally {
      setLoadingCombos(false);
    }
  };
  loadCombos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (formMode === "edit" && selectedRow) {
      setFormData({
        id: selectedRow.id ?? null,
        almacenId: selectedRow.almacenId ?? "",
        produccionId: selectedRow.produccionId ?? "",
        descripcion: selectedRow.descripcion ?? "",
        fechaHora: selectedRow.fechaHora ?? "",
        estadoId: (selectedRow.estadoId ?? 1),
        empresaId: selectedRow.empresaId ?? "",
      });
    } else {
      setFormData((prev) => ({
        ...initialData,
        almacenId: almacenId || "",
      }));
    }
  }, [open, formMode, selectedRow, almacenId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.almacenId) newErrors.almacenId = "Almacén no asignado.";
    if (!formData.produccionId) newErrors.produccionId = "Seleccione una producción.";
    if (!formData.fechaHora) newErrors.fechaHora = "La fecha es obligatoria.";
    if (formData.estadoId === undefined || formData.estadoId === null || formData.estadoId === "")
      newErrors.estadoId = "Seleccione estado.";
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
        text: err?.response?.data?.message || "Error al guardar pedido.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Pedido" : "Nuevo Pedido"}</DialogTitle>
      <DialogContent>
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

        <FormControl fullWidth margin="normal" error={!!errors.almacenId} disabled={loadingCombos}>
          <InputLabel>Almacén</InputLabel>
          <Select
            name="almacenId"
            value={formData.almacenId}
            onChange={handleChange}
            label="Almacén"
            displayEmpty
          >
            <MenuItem value="">
              <em>Seleccione un almacén</em>
            </MenuItem>
            {almacenes.map((a) => (
              <MenuItem key={a.id} value={a.id}>
              {a.name ?? a.nombre ?? `Almacén ${a.id}`}
            </MenuItem>
            ))}
          </Select>
          {errors.almacenId && <FormHelperText>{errors.almacenId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.produccionId} disabled={loadingCombos}>
          <InputLabel>Producción</InputLabel>
          <Select
            name="produccionId"
            value={formData.produccionId}
            onChange={handleChange}
            label="Producción"
            displayEmpty
          >
            <MenuItem value="">
              <em>Seleccione una producción</em>
            </MenuItem>
            {producciones.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name ?? p.nombre ?? p.descripcion ?? `Producción ${p.id}`}
              </MenuItem>
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
