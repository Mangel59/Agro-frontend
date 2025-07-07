import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function FormProducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const initialData = {
    nombre: "",
    descripcion: "",
    productoCategoriaId: "",
    unidadMinimaId: "",
    estado: ""
  };

  const [formData, setFormData] = useState(initialData);

  const loadData = () => {
    axios.get("/v1/producto_categoria")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("❌ Error al cargar categorías:", err));

    axios.get("/v1/unidad")
      .then(res => setUnidades(res.data))
      .catch(err => console.error("❌ Error al cargar unidades:", err));
  };

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    loadData();
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un producto para editar." });
      return;
    }

    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      productoCategoriaId: selectedRow.productoCategoriaId?.toString() || "",
      unidadMinimaId: selectedRow.unidadMinimaId?.toString() || "",
      estado: selectedRow.estadoId?.toString() || ""
    });

    setMethodName("Update");
    loadData();
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un producto para eliminar." });
      return;
    }

    axios.delete(`/v1/producto/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Producto eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${err.message}`
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion || !formData.productoCategoriaId || !formData.unidadMinimaId || !formData.estado) {
      setMessage({ open: true, severity: "error", text: "Todos los campos son obligatorios." });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      productoCategoriaId: parseInt(formData.productoCategoriaId),
      unidadMinimaId: parseInt(formData.unidadMinimaId),
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/producto" : `/v1/producto/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Producto creado con éxito!" : "Producto actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        console.error("❌ Error al guardar producto:", err);
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${err.response?.data?.message || err.message || "Datos inválidos"}`
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Producto</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth margin="dense" required name="nombre" label="Nombre"
              value={formData.nombre} onChange={handleChange}
            />
            <TextField
              fullWidth margin="dense" multiline rows={3} name="descripcion" label="Descripción"
              value={formData.descripcion} onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Producto Categoría</InputLabel>
              <Select
                name="productoCategoriaId"
                value={formData.productoCategoriaId}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {categorias.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Unidad Mínima</InputLabel>
              <Select
                name="unidadMinimaId"
                value={formData.unidadMinimaId}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {unidades.map(u => (
                  <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
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