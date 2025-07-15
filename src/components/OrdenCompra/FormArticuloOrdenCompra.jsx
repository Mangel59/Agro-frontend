import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function FormArticuloOrdenCompra({ selectedRow, setSelectedRow, setMessage, reloadData, ordenCompraId }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [presentaciones, setPresentaciones] = useState([]);

  const initialData = {
    cantidad: "",
    precio: "",
    ordenCompraId: ordenCompraId || "",
    presentacionProductoId: "",
    estadoId: "1",
  };

  const [formData, setFormData] = useState(initialData);

  const loadData = () => {
    axios.get("/v1/producto_presentacion")
      .then(res => setPresentaciones(res.data))
      .catch(err => console.error("Error al cargar presentaciones:", err));
  };

  const create = () => {
    setFormData({ ...initialData, ordenCompraId });
    setMethodName("Agregar");
    loadData();
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un artículo para editar." });
      return;
    }
    setFormData({ ...selectedRow, estadoId: selectedRow.estadoId.toString() });
    setMethodName("Actualizar");
    loadData();
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) return;
    axios.delete(`/v1/articulo-orden-compra/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Artículo eliminado correctamente." });
        reloadData();
        setSelectedRow({});
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al eliminar artículo" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      cantidad: parseFloat(formData.cantidad),
      precio: parseFloat(formData.precio),
      ordenCompraId: parseInt(formData.ordenCompraId),
      presentacionProductoId: parseInt(formData.presentacionProductoId),
      estadoId: parseInt(formData.estadoId),
    };

    const method = methodName === "Agregar" ? axios.post : axios.put;
    const url = methodName === "Agregar"
      ? "/v1/articulo-orden-compra"
      : `/v1/articulo-orden-compra/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Guardado correctamente." });
        reloadData();
        setOpen(false);
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al guardar artículo" }));
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Artículo de Orden</DialogTitle>
          <DialogContent>
            <TextField fullWidth name="cantidad" label="Cantidad" value={formData.cantidad} onChange={handleChange} margin="dense" required />
            <TextField fullWidth name="precio" label="Precio" value={formData.precio} onChange={handleChange} margin="dense" required />
            <TextField fullWidth name="ordenCompraId" label="Orden Compra ID" value={formData.ordenCompraId} margin="dense" required disabled />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Presentación</InputLabel>
              <Select name="presentacionProductoId" value={formData.presentacionProductoId} onChange={handleChange}>
                <MenuItem value="">Seleccione...</MenuItem>
                {presentaciones.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select name="estadoId" value={formData.estadoId} onChange={handleChange}>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="0">Inactivo</MenuItem>
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
