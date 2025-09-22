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

// dentro del componente
  const toArray = (d) => {
    if (Array.isArray(d)) return d;
    if (!d || typeof d !== "object") return [];
    return d.content ?? d.items ?? d.data ?? d.results ?? [];
  };

  const loadData = async () => {
    try {
      // usa slash inicial; intenta /0 si el primero falla
      let res;
      try {
        res = await axios.get("/v1/items/producto_presentacion", /* headers opcionales */);
      } catch (e1) {
        res = await axios.get("/v1/items/producto_presentacion/0");
      }
      const arr = toArray(res.data);
      setPresentaciones(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("Error al cargar presentaciones:", err?.response?.status, err?.config?.url, err?.response?.data);
      setPresentaciones([]); // evita el .map is not a function
    }
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
              name="pedidoId"
              label="Pedido ID"
              value={formData.pedidoId}
              margin="dense"
              required
              disabled
            />
            <FormControl fullWidth margin="normal" required>
            <InputLabel>Presentación de prodcuto</InputLabel>
            <Select
              name="presentacionProductoId"
              value={formData.presentacionProductoId}
              onChange={handleChange}
              label="Presentación"
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccione...</em>
              </MenuItem>

              {(presentaciones || []).map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name ?? p.nombre ?? `Presentación ${p.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            <TextField
              fullWidth
              name="cantidad"
              label="Cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              margin="dense"
              required
            />
          
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
