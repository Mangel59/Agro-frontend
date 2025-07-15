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
    presentacionProductoId: "",  
    estadoId: "1"
  };

  const [formData, setFormData] = useState(initialData);

  const loadData = () => {
    axios.get("/v1/producto_presentacion")
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
      presentacionProductoId: parseInt(formData.presentacionProductoId),  
      estadoId: parseInt(formData.estadoId)
    };

    console.log("Payload a enviar:", payload);

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
      .catch((err) => {
        const serverError = err?.response?.data?.message || err?.response?.data || err.message || "Error desconocido";
        console.error("Respuesta completa del backend:", err?.response);
        console.error("Mensaje de error:", serverError);
        setMessage({
          open: true,
          severity: "error",
          text: `Error al guardar: ${serverError}`
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Artículo Pedido</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="cantidad"
              label="Cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              name="pedidoId"
              label="Pedido ID"
              value={formData.pedidoId}
              margin="dense"
              required
              disabled
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Presentación</InputLabel>
              <Select
                name="presentacionProductoId"
                value={formData.presentacionProductoId}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {presentaciones.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estadoId"
                value={formData.estadoId}
                onChange={handleChange}
              >
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
