import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function ({ selectedRow, setSelectedRow, setMessage, reloadData, kardexId }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [presentaciones, setPresentaciones] = useState([]);

  const initialData = {
    cantidad: "",
    precio: "",
    fechaVencimiento: "",
    kardexId: kardexId || "",
    presentacionProductoId: "",
    estadoId: "1",
  };

  const [formData, setFormData] = useState(initialData);

  // 👇 NUEVO: normalizador de respuestas
  const toArray = (d) =>
    Array.isArray(d) ? d : (d?.content ?? d?.items ?? d?.data ?? d?.results ?? []);

  // 👇 NUEVO: construir etiqueta legible según posibles formas del objeto
  const ppLabel = (p) => {
    const base =
      p.name ?? p.nombre ??
      [ p.producto?.nombre ?? p.productoNombre,
        p.presentacion?.nombre ?? p.presentacionNombre,
        p.cantidad ? `${p.cantidad} ${p.unidad?.nombre ?? p.unidadNombre ?? ""}`.trim() : null
      ].filter(Boolean).join(" · ");
    return base || `Presentación ${p.id}`;
  };

  // 👇 NUEVO: cargar catálogo
  const loadData = async () => {
    try {
      const res = await axios.get("/v1/items/producto_presentacion/0");
      setPresentaciones(toArray(res.data));
    } catch (err) {
      console.error("Error al cargar presentaciones:", err);
      setPresentaciones([]);
    }
  };

  const create = () => {
    if (!kardexId) {
      setMessage({ open: true, severity: "error", text: "Debes seleccionar un Kardex antes de crear un artículo." });
      return;
    }
    setFormData(prev => ({ ...initialData, kardexId }));
    setMethodName("Agregar");
    loadData();               // 👈 asegura catálogo cargado
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un artículo para editar." });
      return;
    }
    setFormData({
      ...initialData,
      ...selectedRow,
      // 👇 por si el backend retorna el objeto embebido
      presentacionProductoId: selectedRow.presentacionProducto?.id ?? selectedRow.presentacionProductoId ?? "",
      estadoId: String(selectedRow.estadoId ?? 1),
    });
    setMethodName("Actualizar");
    loadData();               // 👈 asegura catálogo cargado
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) return;
    axios.delete(`/v1/articulo-kardex/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
        reloadData();
        setSelectedRow({});
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al eliminar" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 👇 convierte ids y numéricos a número cuando aplique
    const numeric = new Set(["kardexId","presentacionProductoId","estadoId","cantidad","precio"]);
    const cast = numeric.has(name) && value !== "" ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: cast }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      id: selectedRow.id,
      cantidad: Number(formData.cantidad),
      precio: Number(formData.precio),
      kardexId: Number(formData.kardexId),
      presentacionProductoId: Number(formData.presentacionProductoId),
      estadoId: Number(formData.estadoId),
      fechaVencimiento: String(formData.fechaVencimiento).includes("T")
        ? formData.fechaVencimiento
        : `${formData.fechaVencimiento}T00:00:00`,
    };

    const method = methodName === "Agregar" ? axios.post : axios.put;
    const url = methodName === "Agregar" ? "/v1/articulo-kardex" : `/v1/articulo-kardex/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Guardado correctamente." });
        reloadData();
        setOpen(false);
      })
      .catch(err => {
        const status = err?.response?.status;
        const backendMessage = err?.response?.data?.message;
        let errorMsg = "Error al guardar";
        if (status === 403) errorMsg = backendMessage || "No tienes permisos para guardar con este estado.";
        else if (backendMessage) errorMsg = backendMessage;
        console.error("Error al guardar:", err.response || err);
        setMessage({ open: true, severity: "error", text: errorMsg });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Artículo Kardex</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="kardexId"
              label="Kardex ID"
              value={formData.kardexId}
              margin="dense"
              required
              disabled
            />

            {/* Producto Presentación */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="pp-label">Producto Presentación</InputLabel>
              <Select
                labelId="pp-label"
                label="Producto Presentación"
                name="presentacionProductoId"
                value={formData.presentacionProductoId ?? ""}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Seleccione...</em>
                </MenuItem>
                {presentaciones.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {ppLabel(p)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField fullWidth name="cantidad" label="Cantidad" value={formData.cantidad} onChange={handleChange} margin="dense" required />
            <TextField fullWidth name="precio" label="Precio" value={formData.precio} onChange={handleChange} margin="dense" required />
            <TextField
              fullWidth type="date" name="fechaVencimiento" label="Fecha Vencimiento"
              value={(formData.fechaVencimiento || "").toString().substring(0, 10)}
              onChange={handleChange} margin="dense" InputLabelProps={{ shrink: true }} required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                label="Estado"
                name="estadoId"
                value={formData.estadoId}
                onChange={handleChange}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={2}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
