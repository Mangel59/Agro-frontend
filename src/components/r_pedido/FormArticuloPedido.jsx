
import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function FormArticuloPedido({ selectedRow, setSelectedRow, setMessage, reloadData, pedidoId }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [presentaciones, setPresentaciones] = useState([]);

  const initialData = {
    cantidad: "",
    pedidoId: pedidoId || "",
    productoPresentacionId: "",
    estadoId: "1"
  };

  const [formData, setFormData] = useState(initialData);

  const loadData = () => {
    axios.get("/v1/presentacion")
      .then(res => setPresentaciones(res.data))
      .catch(err => console.error("Error al cargar presentaciones:", err));
  };

  const create = () => {
    setFormData(prev => ({ ...initialData, pedidoId: pedidoId || "" }));
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
    axios.delete(`/v1/articulo-pedido/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
        reloadData();
        setSelectedRow({});
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al eliminar" }));
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
      pedidoId: parseInt(formData.pedidoId),
      productoPresentacionId: parseInt(formData.productoPresentacionId),
      estadoId: parseInt(formData.estadoId)
    };

    const method = methodName === "Agregar" ? axios.post : axios.put;
    const url = methodName === "Agregar"
      ? "/v1/articulo-pedido"
      : `/v1/articulo-pedido/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Guardado correctamente." });
        reloadData();
        setOpen(false);
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al guardar" }));
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Artículo Pedido</DialogTitle>
          <DialogContent>
            <TextField fullWidth name="cantidad" label="Cantidad" value={formData.cantidad} onChange={handleChange} margin="dense" required />
            <TextField fullWidth name="pedidoId" label="Pedido ID" value={formData.pedidoId} margin="dense" required disabled />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Presentación</InputLabel>
              <Select name="productoPresentacionId" value={formData.productoPresentacionId} onChange={handleChange}>
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
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
