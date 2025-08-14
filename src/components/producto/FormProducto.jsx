import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function FormProducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    productoCategoriaId: "",
    descripcion: "",
    estadoId: "",
    unidadMinimaId: "",
    ingredientePresentacionProductoId: ""
  });
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    axios.get("/v1/producto_categoria").then(res => setCategorias(res.data)).catch(() => {});
    axios.get("/v1/unidad").then(res => setUnidades(res.data)).catch(() => {});
    axios.get("/v1/ingrediente-presentacion-producto").then(res => setIngredientes(res.data)).catch(() => {});
  }, []);

  const create = () => {
    setFormData({
      nombre: "", productoCategoriaId: "", descripcion: "",
      estadoId: "", unidadMinimaId: "", ingredientePresentacionProductoId: ""
    });
    setErrors({});
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un producto para editar." });
      return;
    }
    setFormData({
      nombre: selectedRow.nombre || "",
      productoCategoriaId: selectedRow.productoCategoriaId || "",
      descripcion: selectedRow.descripcion || "",
      estadoId: selectedRow.estadoId?.toString() || "",
      unidadMinimaId: selectedRow.unidadMinimaId || "",
      ingredientePresentacionProductoId: selectedRow.ingredientePresentacionProductoId || ""
    });
    setErrors({});
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un producto para eliminar." });
      return;
    }
    axios.delete(`/v1/producto/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Campo requerido";
    if (!formData.productoCategoriaId) newErrors.productoCategoriaId = "Campo requerido";
    if (!formData.descripcion.trim()) newErrors.descripcion = "Campo requerido";
    if (!formData.estadoId) newErrors.estadoId = "Campo requerido";
    if (!formData.unidadMinimaId) newErrors.unidadMinimaId = "Campo requerido";
    if (!formData.ingredientePresentacionProductoId) newErrors.ingredientePresentacionProductoId = "Campo requerido";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      estadoId: parseInt(formData.estadoId),
      productoCategoriaId: parseInt(formData.productoCategoriaId),
      unidadMinimaId: parseInt(formData.unidadMinimaId),
      ingredientePresentacionProductoId: parseInt(formData.ingredientePresentacionProductoId)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add"
      ? "/v1/producto"
      : `/v1/producto/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Creado con éxito!" : "Actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Producto</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth name="nombre" label="Nombre"
                  value={formData.nombre} onChange={handleChange}
                  error={!!errors.nombre} helperText={errors.nombre}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.productoCategoriaId}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    name="productoCategoriaId"
                    value={formData.productoCategoriaId}
                    onChange={handleChange}
                    label="Categoría"
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    {categorias.map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.productoCategoriaId}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth name="descripcion" label="Descripción"
                  value={formData.descripcion} onChange={handleChange}
                  error={!!errors.descripcion} helperText={errors.descripcion}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.unidadMinimaId}>
                  <InputLabel>Unidad mínima</InputLabel>
                  <Select
                    name="unidadMinimaId"
                    value={formData.unidadMinimaId}
                    onChange={handleChange}
                    label="Unidad mínima"
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    {unidades.map(u => (
                      <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.unidadMinimaId}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.ingredientePresentacionProductoId}>
                  <InputLabel>Ingrediente presentación</InputLabel>
                  <Select
                    name="ingredientePresentacionProductoId"
                    value={formData.ingredientePresentacionProductoId}
                    onChange={handleChange}
                    label="Ingrediente presentación"
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    {ingredientes.map(i => (
                      <MenuItem key={i.id} value={i.id}>{i.nombre}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.ingredientePresentacionProductoId}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.estadoId}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estadoId"
                    value={formData.estadoId}
                    onChange={handleChange}
                    label="Estado"
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="2">Inactivo</MenuItem>
                  </Select>
                  <FormHelperText>{errors.estadoId}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
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

FormProducto.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired
};
