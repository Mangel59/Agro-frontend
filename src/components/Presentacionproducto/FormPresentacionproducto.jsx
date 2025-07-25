import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormPresentacionproducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const initialData = {
    productoId: "", nombre: "", unidadId: "",
    descripcion: "", estadoId: "", cantidad: "",
    marcaId: "", presentacionId: "", ingredienteId: ""
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  let empresaId = null;
  try {
    const rawToken = localStorage.getItem("token");
    const payload = JSON.parse(atob(rawToken.split(".")[1]));
    empresaId = payload.empresa?.id || null;
  } catch (e) {
    console.error("Error al leer empresaId desde el token", e);
  }

  useEffect(() => {
    axios.get("/v1/producto").then(res => setProductos(res.data || [])).catch(() => setProductos([]));
    axios.get("/v1/unidad").then(res => setUnidades(res.data || [])).catch(() => setUnidades([]));
    axios.get("/v1/marca").then(res => setMarcas(res.data || [])).catch(() => setMarcas([]));
    axios.get("/v1/presentacion").then(res => setPresentaciones(res.data || [])).catch(() => setPresentaciones([]));
    axios.get("/v1/ingrediente").then(res => setIngredientes(res.data || [])).catch(() => setIngredientes([]));
  }, []);

  const create = () => {
    setFormData(initialData);
    setErrors({});
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para editar." });
      return;
    }
    setFormData({
      productoId: selectedRow.productoId || "",
      nombre: selectedRow.nombre || "",
      unidadId: selectedRow.unidadId || "",
      descripcion: selectedRow.descripcion || "",
      estadoId: selectedRow.estadoId?.toString() || "",
      cantidad: selectedRow.cantidad || "",
      marcaId: selectedRow.marcaId || "",
      presentacionId: selectedRow.presentacionId || "",
      ingredienteId: selectedRow.ingredienteId || ""
    });
    setErrors({});
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para eliminar." });
      return;
    }
    axios.delete(`/v1/producto_presentacion/${selectedRow.id}`)
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
    if (!formData.productoId) newErrors.productoId = "Campo requerido";
    if (!formData.nombre.trim()) newErrors.nombre = "Campo requerido";
    if (!formData.unidadId) newErrors.unidadId = "Campo requerido";
    if (!formData.descripcion.trim()) newErrors.descripcion = "Campo requerido";
    if (!formData.estadoId) newErrors.estadoId = "Campo requerido";
    if (!formData.cantidad) newErrors.cantidad = "Campo requerido";
    if (!formData.marcaId) newErrors.marcaId = "Campo requerido";
    if (!formData.presentacionId) newErrors.presentacionId = "Campo requerido";
    if (!formData.ingredienteId) newErrors.ingredienteId = "Campo requerido";
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
      productoId: parseInt(formData.productoId),
      unidadId: parseInt(formData.unidadId),
      estadoId: parseInt(formData.estadoId),
      cantidad: parseFloat(formData.cantidad),
      marcaId: parseInt(formData.marcaId),
      presentacionId: parseInt(formData.presentacionId),
      ingredienteId: parseInt(formData.ingredienteId),
      empresaId
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add"
      ? "/v1/producto_presentacion"
      : `/v1/producto_presentacion/${selectedRow.id}`;

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
          <DialogTitle>{methodName} Producto Presentación</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              {[
                { label: "Producto", name: "productoId", options: productos },
                { label: "Unidad", name: "unidadId", options: unidades },
                { label: "Marca", name: "marcaId", options: marcas },
                { label: "Presentación", name: "presentacionId", options: presentaciones },
                { label: "Ingrediente", name: "ingredienteId", options: ingredientes }
              ].map((field, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <FormControl fullWidth error={!!errors[field.name]}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      label={field.label}
                    >
                      <MenuItem value="">Seleccione...</MenuItem>
                      {field.options.map(opt => (
                        <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>
                      ))}
                    </Select>
                    {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
                  </FormControl>
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth name="nombre" label="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth name="descripcion" label="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.estadoId}>
                  <InputLabel>Estado</InputLabel>
                  <Select name="estadoId" value={formData.estadoId} onChange={handleChange} label="Estado">
                    <MenuItem value="">Seleccione...</MenuItem>
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="0">Inactivo</MenuItem>
                  </Select>
                  {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth type="number" inputProps={{ step: "any", min: 0 }}
                  name="cantidad" label="Cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad}
                />
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

FormPresentacionproducto.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
