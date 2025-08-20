import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, FormControl, InputLabel,
  Select, MenuItem, FormHelperText, Typography, Divider, Box
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

const toList = (data) =>
  Array.isArray(data) ? data
  : Array.isArray(data?.content) ? data.content
  : Array.isArray(data?.data) ? data.data
  : [];

const MENU_PROPS = { PaperProps: { style: { maxHeight: 48 * 6.5 + 8 } } };

export default function FormProducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const initialForm = useMemo(() => ({
    nombre: "",
    productoCategoriaId: "",
    descripcion: "",
    estadoId: "",
    unidadMinimaId: "",
    ingredientePresentacionProductoId: ""
  }), []);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [loadingIngr, setLoadingIngr] = useState(false);

  // Carga de catálogos (tolerante a {content} o array)
  useEffect(() => {
    setLoadingCats(true);
    axios.get("/v1/producto_categoria")
      .then(res => setCategorias(toList(res.data)))
      .catch(() => setCategorias([]))
      .finally(() => setLoadingCats(false));

    setLoadingUnidades(true);
    axios.get("/v1/unidad")
      .then(res => setUnidades(toList(res.data)))
      .catch(() => setUnidades([]))
      .finally(() => setLoadingUnidades(false));

    setLoadingIngr(true);
    axios.get("/v1/ingrediente-presentacion-producto")
      .then(res => setIngredientes(toList(res.data)))
      .catch(() => setIngredientes([]))
      .finally(() => setLoadingIngr(false));
  }, []);

  // Acciones
  const create = () => {
    setFormData(initialForm);
    setErrors({});
    setMethodName("Crear");
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
    setMethodName("Actualizar");
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

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = "Campo requerido";
    if (!formData.productoCategoriaId) e.productoCategoriaId = "Campo requerido";
    if (!formData.descripcion.trim()) e.descripcion = "Campo requerido";
    if (!formData.estadoId) e.estadoId = "Campo requerido";
    if (!formData.unidadMinimaId) e.unidadMinimaId = "Campo requerido";
    if (!formData.ingredientePresentacionProductoId) e.ingredientePresentacionProductoId = "Campo requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      estadoId: parseInt(formData.estadoId, 10),
      productoCategoriaId: parseInt(formData.productoCategoriaId, 10),
      unidadMinimaId: parseInt(formData.unidadMinimaId, 10),
      ingredientePresentacionProductoId: parseInt(formData.ingredientePresentacionProductoId, 10)
    };

    const isCreate = methodName === "Crear";
    const method = isCreate ? axios.post : axios.put;
    const url = isCreate ? "/v1/producto" : `/v1/producto/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: isCreate ? "¡Creado con éxito!" : "¡Actualizado con éxito!"
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
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle>
            {methodName} Producto
            <Typography variant="body2" color="text.secondary">
              Completa la información del producto y su configuración base
            </Typography>
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 2 }}>
            {/* Sección: Información general */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary">Información general</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth size="small"
                    name="nombre" label="Nombre"
                    value={formData.nombre} onChange={handleChange}
                    error={!!errors.nombre} helperText={errors.nombre}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" error={!!errors.productoCategoriaId}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      name="productoCategoriaId"
                      value={formData.productoCategoriaId}
                      onChange={handleChange}
                      label="Categoría"
                      MenuProps={MENU_PROPS}
                      disabled={loadingCats}
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
                    fullWidth size="small" multiline minRows={3}
                    name="descripcion" label="Descripción"
                    value={formData.descripcion} onChange={handleChange}
                    error={!!errors.descripcion} helperText={errors.descripcion}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Sección: Configuración */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="overline" color="text.secondary">Configuración</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" error={!!errors.unidadMinimaId}>
                    <InputLabel>Unidad mínima</InputLabel>
                    <Select
                      name="unidadMinimaId"
                      value={formData.unidadMinimaId}
                      onChange={handleChange}
                      label="Unidad mínima"
                      MenuProps={MENU_PROPS}
                      disabled={loadingUnidades}
                    >
                      <MenuItem value="">Seleccione...</MenuItem>
                      {unidades.map(u => (
                        <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.unidadMinimaId}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" error={!!errors.ingredientePresentacionProductoId}>
                    <InputLabel>Ingrediente presentación</InputLabel>
                    <Select
                      name="ingredientePresentacionProductoId"
                      value={formData.ingredientePresentacionProductoId}
                      onChange={handleChange}
                      label="Ingrediente presentación"
                      MenuProps={MENU_PROPS}
                      disabled={loadingIngr}
                    >
                      <MenuItem value="">Seleccione...</MenuItem>
                      {ingredientes.map(i => (
                        <MenuItem key={i.id} value={i.id}>{i.nombre}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.ingredientePresentacionProductoId}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small" error={!!errors.estadoId}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="estadoId"
                      value={formData.estadoId}
                      onChange={handleChange}
                      label="Estado"
                      MenuProps={MENU_PROPS}
                    >
                      <MenuItem value="">Seleccione...</MenuItem>
                      <MenuItem value="1">Activo</MenuItem>
                      <MenuItem value="2">Inactivo</MenuItem>
                    </Select>
                    <FormHelperText>{errors.estadoId}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">{methodName}</Button>
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
