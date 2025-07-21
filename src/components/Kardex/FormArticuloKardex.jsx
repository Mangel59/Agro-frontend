import React, { useState, useEffect } from "react";
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

  const loadData = () => {
    axios.get("/v1/producto_presentacion")
      .then(res => setPresentaciones(res.data))
      .catch(err => console.error("Error al cargar presentaciones:", err));
  };

  const create = () => {
    if (!kardexId) {
      setMessage({ open: true, severity: "error", text: "Debes seleccionar un Kardex antes de crear un artículo." });
      return;
    }
    setFormData(prev => ({ ...initialData, kardexId }));
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

const payload = {
  ...formData,
  id: selectedRow.id,
  cantidad: parseFloat(formData.cantidad),
  precio: parseFloat(formData.precio),
  kardexId: parseInt(formData.kardexId),
  presentacionProductoId: parseInt(formData.presentacionProductoId),
  estadoId: parseInt(formData.estadoId),
  fechaVencimiento: formData.fechaVencimiento.includes("T")
    ? formData.fechaVencimiento
    : formData.fechaVencimiento + "T00:00:00"
};


    console.log("Payload enviado:", payload);

    const method = methodName === "Agregar" ? axios.post : axios.put;
    const url = methodName === "Agregar"
      ? "/v1/articulo-kardex"
      : `/v1/articulo-kardex/${selectedRow.id}`;

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

        if (status === 403) {
          errorMsg = backendMessage || "No tienes permisos para guardar con este estado.";
        } else if (backendMessage) {
          errorMsg = backendMessage;
        }

        console.error("Error al guardar:", err.response || err);
        setMessage({ open: true, severity: "error", text: errorMsg });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Artículo Kardex</DialogTitle>
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
              name="precio"
              label="Precio"
              value={formData.precio}
              onChange={handleChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              type="date"
              name="fechaVencimiento"
              label="Fecha Vencimiento"
              value={formData.fechaVencimiento?.substring(0, 10)}
              onChange={handleChange}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              name="kardexId"
              label="Kardex ID"
              value={formData.kardexId}
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
                <MenuItem value="2">Inactivo</MenuItem>
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
